import { generateToken } from "../src/utils/generateToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

console.log("--- Starting Authentication & Utility Verification Tests ---");

// Test 1: JWT Token Generation & Verification
try {
  process.env.JWT_SECRET = "test_jwt_secret_key_123";
  const mockId = "651a2f1b4f1b2c001f3e4a50";
  const mockRole = "admin";
  const token = generateToken(mockId, mockRole);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.id === mockId && decoded.role === mockRole) {
    console.log("✓ Test 1 Passed: JWT generation and verification verified successfully.");
  } else {
    throw new Error(`Token payload mismatch: ${JSON.stringify(decoded)}`);
  }
} catch (err) {
  console.error("✗ Test 1 Failed:", err.message);
  process.exit(1);
}

// Test 2: Bcrypt Hashing & Comparison Logic
try {
  const plainPassword = "securePassword123";
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(plainPassword, salt);

  const isValid = bcrypt.compareSync(plainPassword, hash);
  const isInvalid = bcrypt.compareSync("wrongPassword", hash);

  if (isValid && !isInvalid) {
    console.log("✓ Test 2 Passed: Bcrypt hashing and comparison logic verified successfully.");
  } else {
    throw new Error("Bcrypt comparison failed");
  }
} catch (err) {
  console.error("✗ Test 2 Failed:", err.message);
  process.exit(1);
}

// Test 3: Email regex validation check
try {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validEmails = ["admin@demo.com", "user.name@example.co.uk", "customer_1@domain.io"];
  const invalidEmails = ["bademail", "@domain.com", "user@", "user@domain"];

  const allValidsPass = validEmails.every((e) => emailRegex.test(e));
  const allInvalidsFail = invalidEmails.every((e) => !emailRegex.test(e));

  if (allValidsPass && allInvalidsFail) {
    console.log("✓ Test 3 Passed: Email validation patterns verified successfully.");
  } else {
    throw new Error("Email regex validation failure");
  }
} catch (err) {
  console.error("✗ Test 3 Failed:", err.message);
  process.exit(1);
}

console.log("--- All Authentication Tests Passed Successfully! ---");
