import { Tools } from "./Tools.js"

const socket = io()

const canvas = document.querySelector("#map_canvas")
const mapContainer = document.querySelector(".map-container")

const tools = new Tools(canvas)
tools.setCanvasDimensions()