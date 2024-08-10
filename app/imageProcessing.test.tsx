import { describe, expect, test } from "vitest";
import {
  calcResizeToWindow,
  getAdaptedSize,
  hexToRgb,
} from "./imageProcessing";
import { WindowsDimensions } from "./types";

//? No pude crear tests para las funciones que utilizan ImageData ya que es un objeto del DOM y acá estamos en node, y jsdom no lo implementa. Probé crear un mock con lo que me tiraba copilot pero tampoco funcionó.
//? Tampoco están implementadas FileReader y File como para probar la carga del archivo con imagen.

describe("calcResizeToWindow", () => {
  test("when window is smaller than the toolbar", () => {
    const imageWidth = 3000;
    const imageHeight = 2000;
    const windowDimensions = {
      width: 20,
      height: 20,
      mobileToolbarHeight: 64,
    };
    const mainCanvasConfig = {
      maxWidth: 600,
      maxHeight: 600,
      margin: 32,
    };

    //TODO: pendiente corregir esto producto de los cambios en la función. Puede parecer que en lugar de pasar la ref a la funcion haya que pasar el valor de la mobileToolbar para el calculo, pero creo que eso generaba un problema en la función y no recibía el valor correcto. Habría que probar si es así o ver de que modo se puede hacer para testear.
    const { newWidth, newHeight } = calcResizeToWindow(
      imageWidth,
      imageHeight,
      windowDimensions as WindowsDimensions,
      mainCanvasConfig
    );

    expect(newWidth).toBeGreaterThan(0);
    expect(newHeight).toBeGreaterThan(0);
  });

  test("resizes proportionally to fit window horizontally", () => {
    const imageWidth = 3000;
    const imageHeight = 2000;
    const windowDimensions = {
      width: 1920,
      height: 1080,
      mobileToolbarHeight: 64,
    };
    const mainCanvasConfig = {
      maxWidth: 600,
      maxHeight: 600,
      margin: 32,
    };

    const { newWidth, newHeight } = calcResizeToWindow(
      imageWidth,
      imageHeight,
      windowDimensions as WindowsDimensions,
      mainCanvasConfig
    );

    expect(newWidth).toBeGreaterThan(0);
    expect(newHeight).toBeGreaterThan(0);
    expect(newWidth).toBeLessThan(imageWidth);
    expect(newHeight).toBeLessThan(imageHeight);
    expect(newWidth / newHeight).toBeCloseTo(imageWidth / imageHeight, 2);
  });

  test("resizes proportionally to fit window vertically", () => {
    const imageWidth = 2000;
    const imageHeight = 3000;
    const windowDimensions = {
      width: 1920,
      height: 1080,
      mobileToolbarHeight: 64,
    };
    const mainCanvasConfig = {
      maxWidth: 600,
      maxHeight: 600,
      margin: 32,
    };

    const { newWidth, newHeight } = calcResizeToWindow(
      imageWidth,
      imageHeight,
      windowDimensions as WindowsDimensions,
      mainCanvasConfig
    );

    expect(newWidth).toBeGreaterThan(0);
    expect(newHeight).toBeGreaterThan(0);
    expect(newWidth).toBeLessThan(imageWidth);
    expect(newHeight).toBeLessThan(imageHeight);
    expect(newWidth / newHeight).toBeCloseTo(imageWidth / imageHeight, 2);
  });

  test("respects max canvas size", () => {
    const imageWidth = 3000;
    const imageHeight = 2000;
    const windowDimensions = {
      width: 1920,
      height: 1080,
      mobileToolbarHeight: 64,
    };
    const mainCanvasConfig = {
      maxWidth: 600,
      maxHeight: 600,
      margin: 32,
    };

    const { newWidth, newHeight } = calcResizeToWindow(
      imageWidth,
      imageHeight,
      windowDimensions as WindowsDimensions,
      mainCanvasConfig
    );

    expect(newWidth).toBeGreaterThan(0);
    expect(newHeight).toBeGreaterThan(0);
    expect(newWidth).toBeLessThan(imageWidth);
    expect(newHeight).toBeLessThan(imageHeight);
    expect(newWidth).toBeLessThanOrEqual(mainCanvasConfig.maxWidth);
    expect(newHeight).toBeLessThanOrEqual(mainCanvasConfig.maxHeight);
  });
});

describe("getAdaptedSize", () => {
  test("returns original size for square image", () => {
    const canvasMaxWidth = 100;
    const canvasMaxHeight = 100;
    const imageWidth = 100;
    const imageHeight = 100;

    const { width, height } = getAdaptedSize(
      canvasMaxWidth,
      canvasMaxHeight,
      imageWidth,
      imageHeight
    );

    expect(width).toBe(imageWidth);
    expect(height).toBe(imageHeight);
  });

  test("resizes proportionally to fit canvas horizontally (wide image)", () => {
    const canvasMaxWidth = 200;
    const canvasMaxHeight = 100;
    const imageWidth = 400;
    const imageHeight = 200;

    const { width, height } = getAdaptedSize(
      canvasMaxWidth,
      canvasMaxHeight,
      imageWidth,
      imageHeight
    );

    expect(width).toBeLessThanOrEqual(canvasMaxWidth);
    expect(height).toBeLessThanOrEqual(canvasMaxHeight);
    expect(width / height).toBeCloseTo(imageWidth / imageHeight, 2); // Check aspect ratio preserved
  });
  test("resizes proportionally to fit canvas vertically (tall image)", () => {
    const canvasMaxWidth = 100;
    const canvasMaxHeight = 200;
    const imageWidth = 200;
    const imageHeight = 400;

    const { width, height } = getAdaptedSize(
      canvasMaxWidth,
      canvasMaxHeight,
      imageWidth,
      imageHeight
    );

    expect(width).toBeLessThanOrEqual(canvasMaxWidth);
    expect(height).toBeLessThanOrEqual(canvasMaxHeight);
    expect(width / height).toBeCloseTo(imageWidth / imageHeight, 2); // Check aspect ratio preserved
  });
});

describe("hexToRgb", () => {
  test("converts valid hex color to RGB object", () => {
    const hexColor = "ff0000";
    const expectedRgb = { red: 255, green: 0, blue: 0 };

    const rgb = hexToRgb(hexColor);

    expect(rgb).toEqual(expectedRgb);
  });

  test("converts hex color with # to RGB object", () => {
    const hexColor = "#00ff00";
    const expectedRgb = { red: 0, green: 255, blue: 0 };

    const rgb = hexToRgb(hexColor);

    expect(rgb).toEqual(expectedRgb);
  });

  test("throws error for invalid hex color", () => {
    expect(() => hexToRgb("abc")).toThrowError();
    expect(() => hexToRgb("#12345")).toThrowError(); // Invalid length
    expect(() => hexToRgb("#gggggg")).toThrowError(); // Invalid characters
  });
});
