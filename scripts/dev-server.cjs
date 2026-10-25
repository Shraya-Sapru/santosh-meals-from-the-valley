// Local-dev-only entry point. Some launchers spawn `next dev <dir>` without
// actually chdir'ing the Node process there — `next dev` resolves routing
// from the directory argument, but our own code reads source/, data/, and
// .env relative to process.cwd(), so it must match. A normal `cd repo &&
// npm run dev` already has the right cwd and doesn't need this file.
const path = require("node:path");

process.chdir(path.resolve(__dirname, ".."));
process.argv = [process.argv[0], process.argv[1], "dev", "--port", "3100"];

require("next/dist/bin/next");
