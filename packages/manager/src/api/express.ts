import axios from "axios";

export const express = axios.create({
  baseURL: "/",
  headers: { Accept: "application/json" },
});
