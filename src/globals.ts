export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export const getUserToken = () => localStorage.getItem("token");

export const getGithubUsername = () => localStorage.getItem("username");

export function setGithubUsername(username: string) {
  localStorage.setItem("username", username);
}

export function removeGithubUsername() {
  localStorage.removeItem("username");
}
