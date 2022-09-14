import bycrypt from "bcryptjs";

const hashPassword = (password, strength = 5) => {
  try {
    const salt = bycrypt.genSaltSync(strength);
    const hashedPassword = bycrypt.hashSync(password, salt);
    // console.log(hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.log(" bycrypt" + error.message);
  }
};

const verifyPassword = (password, userPass) => {
  const verify = bycrypt.compareSync(password, userPass);
  return verify;
};

const comparePassword = (password, uPass) => bycrypt.compare(password, uPass)

export { hashPassword, verifyPassword,comparePassword };
