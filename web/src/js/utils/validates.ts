import { signInValidates } from "../requests/validates";
import validate from "validate.js";
import { CallbackLoaderInputState } from "../components/CallbackLoaders/types";

const validateEmailWithRequest: (
  email: string
) => Promise<CallbackLoaderInputState> = async function (email) {
  if (!email){
    return { error: true, helperText: "Required." };
  }
  const validateResult = validate.single(email, {
    presence: true,
    email: {
      message:'Invalid email.'
    }
  });
  if (validateResult) {
    return {
      error: true,
      helperText: validateResult.join("; "),
    };
  }

  try {
    const data = await signInValidates("email", email);
    if (data) return { error: true, helperText: "Email already exists." };
    return { error: false, helperText: "" };
  } catch (err) {
    console.log(`Email validation gone wrong.`);
    throw err;
  }
}

const validateUsernameWithRequest: (
  username: string
) => Promise<CallbackLoaderInputState> = async function (username) {
  if (!username){
    return { error: true, helperText: "Required." };
  }
  const validateResult = validate.single(username, {
    presence: true,
    format: {
      pattern:/^[aA-zZ0-9]+$/g,
      message: "Should only contain characters and numbers"
    }
  });
  if (validateResult) {
    return {
      error: true,
      helperText: validateResult.join("; "),
    };
  }

  try {
    const data = await signInValidates("username", username);
    if (data) return { error: true, helperText: "Username already exists." };
    return { error: false, helperText: "" };
  } catch (err) {
    console.log(`Username validation gone wrong.`);
    throw err;
  }
}

const validatePassword: (
  password: string
) => Promise<CallbackLoaderInputState> = async function (password) {
  if (!password){
    return { error: true, helperText: "Required." };
  }
  const validateResult = validate.single(password, {
    presence: true,
    length: {minimum: 8, message:"Password should be 8 character length minimum"},
    format:{
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g,
      message: "Should contain number, special character and uppercase letter."
    }
  });
  if (validateResult) {
    console.log(validateResult)
    return {
      error: true,
      helperText: validateResult.join("; "),
    };
  }
  return {
    error:false, 
    helperText: ""
  }
}
export { validateEmailWithRequest, validateUsernameWithRequest, validatePassword };
