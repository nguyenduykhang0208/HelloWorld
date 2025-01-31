import express from "express";

let configViewEngine = (app) => {
    app.use(express.static("./viewEngine.js"));
    app.set("view engine", "ejs");
    app.set("views", "./src/views")
}

module.exports = configViewEngine;