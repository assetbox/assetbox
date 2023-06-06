import axios from "axios";

export const express = axios.create({
  baseURL: "http://localhost:6001",
  headers: { Accept: "application/json" },
});
