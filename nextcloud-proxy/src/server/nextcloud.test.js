const request = require('./request');
jest.mock("./request");

const mockDirectories = require("./testdata");
const { prepareNext, fillCache, loadedAlbums, cache } = require("./nextcloud");

describe("nextcloud", () => {
    describe("cache", () => {
        it("should handle a missing location correctly", async () => {
            expect(await fillCache()).toBe(undefined);
        });

        describe("when failing to load the cache", () => {
            beforeAll(async () => {
                request.listFiles.mockReset();
                request.listFiles.mockImplementation(() =>
                    Promise.reject(new Error("test")));
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
            beforeAll(async () => {
                request.listFiles.mockReset();
                request.listFiles.mockImplementation((location) =>
                    Promise.resolve(mockDirectories[location]));
                await fillCache("");
            });
            it("should add all nodes", () => {
                expect([...cache].length).toBe(2);
                expect([...cache]).toEqual([12316, 13701]);
            });
            it("should traverse all directories", () => {
                expect([...loadedAlbums]).toEqual(["Sub/Folder"])
            });
        })
    })

    describe("when requesting a new image", () => {
        beforeEach(async () => {
            request.listFiles.mockReset();
            request.listFiles.mockImplementation((location) =>
                Promise.resolve(mockDirectories[location]));
            cache.clear();
            await fillCache("");
        });

        describe("and the query fails", () => {
            let expectedException = null;

            beforeEach(async () => {
                request.download.mockReset();
                request.download.mockImplementation(() =>
                    Promise.reject(new Error("test")));
                try {
                    await prepareNext();
                } catch (e) {
                    expectedException = e;
                }
            })
            it("should handle the error quitely", async () => {
                expect(expectedException).toEqual(null);
            });
            it("should remove the item from the cache", () => {
                expect([...cache].length).toBe(1)
            })
        });
        describe("and the query works", () => {
            beforeEach(async () => {
                request.download.mockReset();
                request.download.mockImplementation(() =>
                    Promise.resolve());
                await prepareNext();
            })
            it("should download the correct file", async () => {
                expect(request.download).toBeCalledTimes(1);
                expect([12316, 13701]).toEqual(
                    expect.arrayContaining(request.download.mock.calls[0])
                );
            });
            it("should remove the item from the cache", async () => {
                expect([...cache].length).toBe(1)
            });

            describe("until the cache eventually get empty", () => {
                it("then it should refill the cache", async (done) => {
                    await prepareNext();
                    setImmediate(() => {
                        expect([...cache].length).toBe(2);
                        done();
                    });
                })
            })
        });
    });
})