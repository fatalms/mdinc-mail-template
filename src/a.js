const fs = require("fs");
const path = require("path");

const fontScale = 1.3;
const lineHeightScale = 1.3;

const files = [
  "contact-register-link.html",
  "email-confirm.html",
  "email-supervisor-registration.html",
  "greeting-again-email.html",
  "greeting-email.html",
  "password-recovery.html",
  "rejecting-email.html",
  "supervisor-password-change.html",
].map((p) => path.resolve(__dirname, p));

files.forEach((path) => {
  let a = fs.readFileSync(path, "utf-8");

  a = a.replace(/font-size: (\d+(.\d+)?)px/g, (s, font) => {
    console.log("font:", font);
    return `font-size: ${+font * fontScale}px`;
  });

  a = a.replace(/line-height: (\d+(.\d+)?)px/g, (s, line) => {
    console.log("line:", line);
    return `line-height: ${+line * lineHeightScale}px`;
  });

  fs.writeFileSync(path, a);
});
