import * as SQLite from "expo-sqlite";

export const createDummyDb = async () => {
  return new Promise((resolve, reject) => {
    const dbTest = SQLite.openDatabase(
      "animeDummy.db",
      "1.0.0",
      "anime dummy database"
    );

    dbTest.transaction((tx) =>
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS DummyTable (id text primary key, animeId text )",
        [],
        (result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      )
    );
  });
};

export const initDb = async () => {
  const db = SQLite.openDatabase("anime.db", "1.0.0", "anime database");
  return db;
};

export const getRandomAnime = async (type, genre, db) => {
  return new Promise((resolve, reject) =>
    db.transaction((tx) => {
      var query = "SELECT * FROM Anime ORDER BY RANDOM() LIMIT 1";
      var params = [];
      if (type.value !== "all" && genre.value !== "all") {
        query =
          "SELECT * FROM Anime WHERE type=? AND genres LIKE ? ORDER BY RANDOM() LIMIT 1";
        params = [type.value, `%${genre.value}%`];
      } else if (type.value !== "all") {
        query = "SELECT * FROM Anime WHERE type=? ORDER BY RANDOM() LIMIT 1";
        params = [type.value];
      } else if (genre.value !== "all") {
        query =
          "SELECT * FROM Anime WHERE genres LIKE ? ORDER BY RANDOM() LIMIT 1";
        params = [`%${genre.value}%`];
      }

      tx.executeSql(
        query,
        params,
        (tx, result) => {
          resolve(result.rows.item(0));
        },
        (tx, error) => {
          console.log("RANDOM ANIME ERROR", error);
          reject(error);
        }
      );
    })
  );
};

export const getAnimeById = async (id, db) => {
  return new Promise((resolve, reject) =>
    db.transaction((tx) => {
      const query = "SELECT * FROM Anime WHERE id=? LIMIT 1";
      const params = [id];
      tx.executeSql(
        query,
        params,
        (tx, result) => {
          var anime = result.rows.item(0);
          if (anime) {
            const images = anime.picture ? JSON.parse(anime.picture) : null;
            const imageUrl = Array.isArray(images)
              ? images[images.length - 1].src
              : images
              ? images.src
              : null;
            anime.image = imageUrl;
          }

          resolve(anime);
        },
        (tx, error) => {
          console.log("GET ANIME ERROR", error);
          reject(error);
        }
      );
    })
  );
};

export const getUserAnimeById = async (id, db) => {
  return new Promise((resolve, reject) =>
    db.transaction((tx) => {
      const query = "SELECT * FROM UserAnime WHERE id=? LIMIT 1";
      const params = [id];
      tx.executeSql(
        query,
        params,
        (tx, result) => {
          const anime = result.rows.item(0);
          resolve(anime);
        },
        (tx, error) => {
          console.log("GET ANIME ERROR", error);
          reject(error);
        }
      );
    })
  );
};

export const addMyListAnime = async (id, db) => {
  return new Promise((resolve, reject) => {
    db.transaction(async (tx) => {
      const query = "SELECT * FROM UserAnime WHERE id=? LIMIT 1";
      const params = [id];
      tx.executeSql(
        query,
        params,
        async (tx, result) => {
          const anime = result.rows.item(0);
          if (anime) {
            resolve(result);
          } else {
            const query2 = "INSERT INTO UserAnime (id,animeId) VALUES (?,?)";
            const params2 = [id, id];
            tx.executeSql(
              query2,
              params2,
              async (tx, result) => {
                await updateAnimeAdded(id, true, db);
                resolve(result);
              },
              (tx, error) => {
                console.log("ADD ANIME ERROR", error);
                reject(error);
              }
            );
          }
        },
        (tx, error) => {
          console.log("FIND USER ANIME ERROR", error);
          reject(error);
        }
      );
    });
  });
};

export const updateAnimeAdded = async (id, added, db) => {
  return new Promise((resolve, reject) =>
    db.transaction((tx) => {
      const query = "UPDATE Anime SET added=? WHERE id=?";
      const params = [added, id];
      tx.executeSql(
        query,
        params,
        (tx, result) => {
          resolve(result);
        },
        (tx, error) => {
          console.log("UPDATE ADD ANIME ERROR", error);
          reject(error);
        }
      );
    })
  );
};

export const removeMyListAnime = async (id, db) => {
  return new Promise((resolve, reject) =>
    db.transaction((tx) => {
      const query = "DELETE FROM UserAnime WHERE animeId=?";
      const params = [id];
      tx.executeSql(
        query,
        params,
        async (tx, result) => {
          await updateAnimeAdded(id, false, db);
          resolve(result);
        },
        (tx, error) => {
          console.log("DELETE ADD ANIME ERROR", error);
          reject(error);
        }
      );
    })
  );
};

export const getMyListAnime = async (db) => {
  return new Promise((resolve, reject) =>
    db.transaction((tx) => {
      const query =
        "SELECT * FROM UserAnime JOIN Anime ON Anime.id = UserAnime.animeId";
      const params = [];
      tx.executeSql(
        query,
        params,
        (tx, result) => {
          resolve(result.rows._array);
        },
        (tx, error) => {
          console.log("GET MY LIST ERROR", error);
          reject(error);
        }
      );
    })
  );
};

export const getRelatedAnime = (related, db) => {
  var animeRelated = [];
  return new Promise(async (resolve, reject) => {
    for (const anime of related) {
      const ra = await getAnimeById(anime.id, db);
      animeRelated.push(ra);
    }

    resolve(animeRelated.filter((anime) => anime !== undefined));
  });
};
