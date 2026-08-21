// MODEL: Connect database and define the schema for User + business logic related to model
import mongoose from 'mongoose'; // ODM
import bcrypt from 'bcryptjs'; // hashing password
import jwt from 'jsonwebtoken'; // generate token
import { encrypt, decrypt, hashForLookup } from '../utils/encryption.js'; // AES-256-GCM at-rest encryption for PII

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: false,
    },
    // Stored as AES-256-GCM ciphertext (see the pre-save hook below), never as plaintext.
    email: {
      type: String,
      required: false,
    },
    // Deterministic HMAC of the normalized email, used as a blind index so we
    // can still look users up by email even though `email` itself is encrypted.
    // DO NOT NEED THIS MATE
    emailHash: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    field: {
      type: String,
      required: false,
    },
    goal: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword(next) {
  // get the current user
  // check if the password is modified
  // if yes, hash the password
  const user = this;
  if (user.isModified('password')) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
  next();
});

userSchema.pre('save', function encryptEmail(next) {
  // only re-encrypt when a plaintext email was actually assigned (mirrors the
  // password hook above) — otherwise an already-encrypted value would get
  // encrypted a second time on every unrelated save
  const user = this;
  if (user.isModified('email') && user.email) {
    user.emailHash = hashForLookup(user.email);
    user.email = encrypt(user.email);
  }
  next();
});

// toJSON
userSchema.methods.toJSON = function toJSON() {
  // get the user
  // turn it into object
  // delete the password
  // return the user object

  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.emailHash;
  if (userObject.email) {
    userObject.email = decrypt(userObject.email);
  }
  return userObject;
};

userSchema.methods.generateAuthToken = async function generateAuthToken() {
  const user = this;

  // Generate a token which expeiresIn 1h for this user inside jwt it should contain user.id, while create one using this JWT_SECRET.
  const token = jwt.sign(
    {
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email ? decrypt(user.email) : undefined,
      role: user.role,
      field: user.field,
      goal: user.goal,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
  // set the token
  user.token = token;
  // save the token to DB
  await user.save();

  // return the token
  return user;
};

export default mongoose.model('User', userSchema);
