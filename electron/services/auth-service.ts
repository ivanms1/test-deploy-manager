import jwtDecode from "jwt-decode";
import axios, { AxiosRequestConfig } from "axios";
import url from "url";

import db from "../store/db";
import logger from "../logger";

import envVariables from "../../env-variables.json";

const { clientId, clientSecret, kakaoApiKey } = envVariables;

const redirectUri = "http://localhost/callback";

let accessToken: string | null = null;
let profile: {
  given_name?: string;
  family_name?: string;
  nickname?: string;
  name?: string;
  email?: string;
  picture?: string;
} | null = null;

function getAccessToken() {
  return accessToken;
}

function getProfile() {
  return profile;
}

function getAuthenticationGoogleURL() {
  return `https://accounts.google.com/o/oauth2/v2/auth?scope=profile email&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
}

function getAuthenticationKakaoURL() {
  return `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoApiKey}&redirect_uri=${redirectUri}&prompt=login`;
}

async function loadTokens(callbackURL: string, provider: "google" | "kakao") {
  const urlParts = url.parse(callbackURL, true);
  const { query } = urlParts;

  const exchangeOptions: any = {
    grant_type: "authorization_code",
    client_id: provider === "google" ? clientId : kakaoApiKey,
    code: query.code,
    redirect_uri: redirectUri,
  };

  const googleOptions: AxiosRequestConfig = {
    method: "POST",
    url: `https://oauth2.googleapis.com/token?code=${exchangeOptions.code}&client_id=${exchangeOptions.client_id}&redirect_uri=${exchangeOptions.redirect_uri}&grant_type=authorization_code&client_secret=${clientSecret}`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  const kakaoOptions: AxiosRequestConfig = {
    method: "POST",
    url: `https://kauth.kakao.com/oauth/token?code=${exchangeOptions.code}&client_id=${exchangeOptions.client_id}&redirect_uri=${exchangeOptions.redirect_uri}&grant_type=authorization_code`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await axios(
      provider === "google" ? googleOptions : kakaoOptions
    );
    accessToken = response.data.access_token;

    if (response?.data?.id_token) {
      profile = jwtDecode(response.data.id_token);

      const user = await db.get("userDetails");
      db.put({ ...user, ...profile });
    } else {
      const { data } = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });

      profile = {
        given_name: data?.properties?.nickname,
        email: data?.kakao_account?.email,
        picture: data?.properties?.thumbnail_image,
      };

      const user = await db.get("userDetails");
      db.put({ ...user, ...profile });
    }
  } catch (error) {
    logger("load-token-error", error?.message, "error");
    throw error;
  }
}

export {
  getAccessToken,
  getAuthenticationGoogleURL,
  getAuthenticationKakaoURL,
  getProfile,
  loadTokens,
};
