import {
  readPasswordData,
  savePasswordData,
  generateNewPassword,
  verifySync,
} from "../helper.js";

test("passwords stay in sync", () => {
  // verify start state
  expect(verifySync()).toBe(true);

  const creds = readPasswordData();
  const newPassword = generateNewPassword();
  const updated = { email: creds.email, password: newPassword };

  savePasswordData(updated);

  // verify after update
  expect(verifySync()).toBe(true);

  const latest = readPasswordData();
  expect(latest.password).toBe(newPassword);
});
