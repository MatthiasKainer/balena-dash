const request = require("./request");
jest.mock("./request");

const mockDirectories = require("./testdata");
const { prepareNext, fillCache, loadedAlbums, cache } = require("./nextcloud");

let mockPrepare = () => {
  console.log = jest.fn();
  console.error = jest.fn();
};

describe("nextcloud", () => {
  beforeEach(mockPrepare);
  afterEach(() => {
    jest.resetAllMocks();
    cache.clear();
  });
  describe("cache", () => {
    it("should handle a missing location correctly", async () => {
      expect(await fillCache()).toBe(undefined);
    });

    describe("when failing to load the cache", () => {
      beforeAll(async () => {
        console.log = jest.fn();
        request.listFiles.mockReset();
        request.listFiles.mockImplementation(() =>
          Promise.reject(new Error("test"))
        );
      });
      it("should fail", async () => {
        expect.assertions(1);
        try {
          await fillCache("");
        } catch (e) {
          expect(e).toEqual(new Error("test"));
        }
      });
    });

    describe("when loading the cache successfully", () => {
      beforeEach(async () => {
        cache.clear();
        request.listFiles.mockReset();
        request.listFiles.mockImplementation((location) =>
          Promise.resolve(mockDirectories[location])
        );
        await fillCache("");
      });
      it("should add all nodes", () => {
        expect([...cache].length).toBe(4);
        expect([...cache]).toEqual([
          "12316|1547927418|rootImg.jpg",
          "13701|1546431465|Sub/Folder/folderimg.jpg",
          "13702|1546431466|Sub/Folder/folderimg.jpg",
          "13702|1546431466|Sub/Folder/folderimg2.jpg",
        ]);
      });
      it("should traverse all directories", () => {
        expect([...loadedAlbums]).toEqual(["Sub/Folder"]);
      });
    });
  });

  describe("when requesting a new image", () => {
    beforeEach(async () => {
      cache.clear();
      request.listFiles.mockReset();
      request.listFiles.mockImplementation((location) =>
        Promise.resolve(mockDirectories[location])
      );
      await fillCache("");
      expect([...cache].length).toBe(3);
    });

    describe("and the query fails", () => {
      let expectedException = null;

      beforeEach(async () => {
        request.download.mockReset();
        request.download.mockImplementation(() =>
          Promise.reject(new Error("test"))
        );
        try {
          await prepareNext();
        } catch (e) {
          expectedException = e;
        }
      });
      it("should handle the error quitely", async () => {
        expect(expectedException).toEqual(null);
      });
      it("should remove the item from the cache", () => {
        expect([...cache].length).toBe(2);
      });
    });
    describe("and the query works", () => {
      beforeEach(async () => {
        cache.clear();
        request.listFiles.mockReset();
        request.listFiles.mockImplementation((location) =>
          Promise.resolve(mockDirectories[location])
        );
        request.download.mockReset();
        request.download.mockImplementation(() => Promise.resolve());
        await fillCache("");
        await new Promise((resolve) => {
            process.nextTick(resolve)
        })
        await prepareNext();
        expect([...cache].length).toBe(2);
      });
      it("should download the correct file", async () => {
        expect(request.download).toBeCalledTimes(1);
        expect([
            "12316", "1547927418", "https://undefined/remote.php/webdav/rootImg.jpg",
        ]).toEqual(expect.arrayContaining(request.download.mock.calls[0]));
      });
      it("should remove the item from the cache", async () => {
        expect([...cache].length).toBe(2);
      });

      describe("until the cache eventually get empty", () => {
        it("then it should refill the cache", async (done) => {
          await prepareNext();
          setImmediate(() => {
            expect([...cache].length).toBe(3);
            done();
          });
        });
      });
    });
  });
});
