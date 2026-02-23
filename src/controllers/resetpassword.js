import bcrypt from "bcrypt";

// const newPassword = "admin@1234";
const UserPassword ="sam@asd"
const saltRounds = 10;


bcrypt.hash(newPassword, saltRounds).then(hash => {
  console.log("Copy this hash:");
  console.log(hash);
});
