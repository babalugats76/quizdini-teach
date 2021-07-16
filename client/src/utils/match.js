import { generateJSON } from "@tiptap/core";
import { Node } from "@tiptap/core";
import Code from "@tiptap/extension-code";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import escapeHtml from "escape-html";
import parse from "csv-parse/lib/sync";
import DOMPurify from "dompurify";

const PURIFY_OPTS = {
  ALLOWED_TAGS: ["u", "code", "sup", "sub"],
  ALLOWED_ATTR: [""],
};

export const matchToString = (matches) => {
  return matches.reduce((accum, vals) => {
    return accum + vals.term + ", " + vals.definition + "\n";
  }, "");
};

/**
 * Converts bulk string of matches to a properly-formatted array.
 * Term and definition values should be comma-delimited.
 * Each "match" item should be newline-delimited.
 *
 * This function performs three major functions
 *    Parsing - Splitting text into matches
 *    Sanitizing - Insuring that all inline HTML is safe
 *    Dedup - Enforcing the business rule that matches shall be unique
 *
 * @param {string} bulkMatches Match content to parse.
 * @param {number} maxMatches Maximum # of matches to parse.
 * @return {Array} Parsed matches.
 */
export const parseMatch = (bulkMatches, maxMatches) => {
  const parsed = parse(bulkMatches, {
    /* Use custom cast function to preserve double-quoted fields */
    cast: function (value, context) {
      return context.quoting ? `"${value}"` : value;
    },
    comment: "#",
    columns: ["term", "definition"], // Give our two columns a name
    delimiter: ",",
    skip_empty_lines: true, // Skip empty lines, e.g., \n
    skip_lines_with_error: true, // Ignore failed lines, e.g, misused quotes
    rtrim: true, // Remove whitespace from the right
    ltrim: true, // Remove whitespace from the left
    relax_column_count: true, // Do not throw error on invalid # of columns
  });

  // finally, sanitize, dedup both columns
  let matches = new Array(0).fill(null); // Create empty array (to store matches)
  let uniqueTerms = new Map(); // Create empty map (to store terms seen thus far)

  for (let i = 0; i < parsed.length; i++) {
    let match = parsed[i];
    //console.log('parsed match');
    //console.log(match);
    if (!match.term || !match.definition) {
      continue;
    }
    const term = DOMPurify.sanitize(match.term.trim(), PURIFY_OPTS); // Trim and HTML sanitize term
    const definition = DOMPurify.sanitize(match.definition.trim(), PURIFY_OPTS); // Trim and HTML sanitize definition
    if (
      term.length !== 0 && // Push if fields are non-empty
      definition.length !== 0 &&
      !uniqueTerms.has(term)
    ) {
      // Skip if term is a duplicate
      uniqueTerms.set(term, true); // Keep track of terms seen so far
      matches.push({ term, definition }); // Add to results
    }
    if (matches.length >= maxMatches) {
      break;
    }
  }
  return matches; // Return results
};

// customize schema to restrict to single paragraph
const Document = Node.create({
  name: "doc",
  topNode: true,
  content: "block", // used to restrict to single paragraph
});

const VALID_TYPES = [
  { type: "code", tag: "code" },
  { type: "subscript", tag: "sub" },
  { type: "superscript", tag: "sup" },
  { type: "underline", tag: "u" },
];

export const extensions = ({ placeholder = "" } = {}) => [
  Code, // use backticks
  Document, // required per tiptap docs
  History,
  Paragraph,
  Placeholder.configure({ placeholder }), // to show tip text, etc.
  Text, // required per tiptap docs
  Subscript, // add <sub> support
  Superscript, // add <sup> support
  Underline, // add <u> support
];

export const serializeToHtml = (json) => {
  const { marks, text, type } = json;
  if (type === "doc" || type === "paragraph") {
    const { content = [] } = json;
    return content.map((n) => serializeToHtml(n)).join("");
  }
  if (type === "text") {
    if (!marks) return escapeHtml(text);
    const { tag } = VALID_TYPES.find((t) => t.type === marks[0].type) || {};
    if (tag) return `<${tag}>${escapeHtml(text)}</${tag}>`;
  }
};

export const toJSON = (html, config = {}) => generateJSON(html, extensions(config));
