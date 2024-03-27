import { describe, expect, test } from "vitest";
import { calcResizeToWindow } from "./imageProcessing";
import { WindowsDimensions } from "./types";

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
