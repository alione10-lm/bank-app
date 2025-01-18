const SetToLocaleStorage = (currentUser) => {
  localStorage.setItem("user", JSON.stringify(currentUser));
};
const GetFromLocaleStorage = (key) => {
  const userDataString = localStorage.getItem(key);
  const userData = JSON.parse(userDataString);
  return userData;
};
export { SetToLocaleStorage, GetFromLocaleStorage };
