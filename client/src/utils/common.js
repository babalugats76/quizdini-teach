/**
 * Augments array of objects with colors (based on scheme).
 *
 * @param {Array} array         array (of objects) to assign color
 * @param {string} colorScheme  game color scheme, i.e., 'rainbow'
 * @return {Array}              augmented match objects
 */
export function addColor(array, colorScheme) {
  let colors = [
    "red",
    "orange",
    "yellow",
    "lime",
    "green",
    "cyan",
    "blue",
    "purple",
    "magenta",
    "navy",
    "gray",
    "teal",
  ];

  switch (colorScheme.toLowerCase()) {
    case "rainbow":
      return array.map((obj) => {
        let rand = Math.floor(Math.random() * colors.length);
        let color = colors[rand];
        colors.splice(rand, 1);
        return {
          ...obj,
          color,
        };
      });
    default:
      return array.map((obj) => {
        return {
          ...obj,
          color: "", // empty string for color represents default
        };
      });
  }
}

/**
 * Shuffles arrays of objects, etc.
 *
 * @param {Array} array  array to shuffle
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Updates single object into array of objects.
 *
 * Avoids mutation by creating new version of array
 * which can be used in state assignments, etc.
 *
 * @param {Array} array  array of objects
 * @param {object} obj   object to update
 * @param {string} key   property to used in equality check
 */
export function updateObjInArray(array, obj, key = "id") {
  return Object.prototype.hasOwnProperty.call(obj, key)
    ? array.map((i) => (i[key] !== obj[key] ? i : { ...i, ...obj }))
    : array;
}

/**
 * "Upserts" object into array of objects.
 *
 * If exists, updates; otherwise, inserts
 *
 * Avoids mutation by creating new version of array
 * which can be used in state assignments, etc.
 *
 * @param {Array} array         array of objects
 * @param {object} obj          object to upsert
 * @param {string} key          property to used in equality check
 * @param {function} transform  lookup transform function (optional)
 */
export function upsertArray(array, obj, key = "id", transform = undefined) {
  if (!Object.prototype.hasOwnProperty.call(obj, key)) return array;
  const lookup = array.find((i) => i[key] === obj[key]);
  const upsert = transform ? transform(lookup) : obj;
  return lookup
    ? array.map((i) => (i[key] !== upsert[key] ? i : { ...i, ...upsert }))
    : array.concat(upsert);
}

/**
 * Determines whether a POJO is empty.
 *
 * @param {Object} obj  object to check
 */
export function isEmpty(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}
