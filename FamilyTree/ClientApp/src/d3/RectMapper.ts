import { TreeNode } from "../model/TreeInterfaces";

export const RECT_WIDTH = 231;
export const RECT_HEIGHT = 123;

//TODO PRZENIESC DO KOMPONENTOW
export const X_SEP = RECT_WIDTH + 100;
export const Y_SEP = RECT_HEIGHT + 100;
export const displayMap = function (node: TreeNode): string {
  if (node.data && node.data.style) {
    switch (node.data.style.display) {
      case true:
        return "true";
      case false:
        return "none";
    }
  }
  return "true";
};

export const rectX = (node: TreeNode): number => {
  return node.x - RECT_WIDTH / 2;
};
export const rectY = (node: TreeNode): number => {
  return node.y - RECT_HEIGHT / 2;
};

export const rectFill = (node: TreeNode): string => {
  return "white";
};

export const rectStroke = (node: TreeNode): string => {
  return "#529587";
};
export const deleteIcon =
  "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z";
export const plusIcon =
  "M213.96 98L213.98 98L213.99 98L214.01 98.01L214.02 98.01L214.04 98.01L214.05 98.02L214.06 98.02L214.08 98.03L214.09 98.03L214.1 98.04L214.11 98.05L214.13 98.05L214.14 98.06L214.15 98.07L214.16 98.08L214.17 98.09L214.18 98.1L214.19 98.11L214.2 98.12L214.21 98.13L214.22 98.14L214.23 98.15L214.24 98.16L214.25 98.17L214.25 98.18L214.26 98.2L214.27 98.21L214.27 98.22L214.28 98.23L214.28 98.25L214.29 98.26L214.29 98.28L214.29 98.29L214.3 98.3L214.3 98.32L214.3 98.33L214.3 98.35L214.3 98.36L214.3 105.7L221.63 105.7L221.65 105.7L221.66 105.7L221.68 105.7L221.69 105.7L221.71 105.71L221.72 105.71L221.74 105.71L221.75 105.72L221.76 105.72L221.78 105.73L221.79 105.73L221.8 105.74L221.81 105.75L221.83 105.75L221.84 105.76L221.85 105.77L221.86 105.78L221.87 105.79L221.88 105.8L221.89 105.81L221.9 105.82L221.91 105.83L221.92 105.84L221.93 105.85L221.94 105.86L221.95 105.87L221.95 105.88L221.96 105.9L221.97 105.91L221.97 105.92L221.98 105.93L221.98 105.95L221.99 105.96L221.99 105.98L221.99 105.99L222 106L222 106.02L222 106.03L222 106.05L222 106.06L222 111.93L222 111.95L222 111.96L222 111.98L222 111.99L221.99 112L221.99 112.02L221.99 112.03L221.98 112.05L221.98 112.06L221.97 112.07L221.97 112.09L221.96 112.1L221.95 112.11L221.95 112.12L221.94 112.14L221.93 112.15L221.92 112.16L221.91 112.17L221.9 112.18L221.89 112.19L221.88 112.2L221.87 112.21L221.86 112.22L221.85 112.23L221.84 112.24L221.83 112.24L221.81 112.25L221.8 112.26L221.79 112.26L221.78 112.27L221.76 112.27L221.75 112.28L221.74 112.28L221.72 112.29L221.71 112.29L221.69 112.29L221.68 112.29L221.66 112.3L221.65 112.3L221.63 112.3L214.3 112.3L214.3 119.63L214.3 119.65L214.3 119.66L214.3 119.68L214.3 119.69L214.29 119.7L214.29 119.72L214.29 119.73L214.28 119.75L214.28 119.76L214.27 119.77L214.27 119.79L214.26 119.8L214.25 119.81L214.25 119.82L214.24 119.84L214.23 119.85L214.22 119.86L214.21 119.87L214.2 119.88L214.19 119.89L214.18 119.9L214.17 119.91L214.16 119.92L214.15 119.93L214.14 119.94L214.13 119.94L214.11 119.95L214.1 119.96L214.09 119.96L214.08 119.97L214.06 119.97L214.05 119.98L214.04 119.98L214.02 119.99L214.01 119.99L213.99 119.99L213.98 119.99L213.96 120L213.95 120L213.93 120L208.07 120L208.05 120L208.04 120L208.02 119.99L208.01 119.99L207.99 119.99L207.98 119.99L207.96 119.98L207.95 119.98L207.94 119.97L207.92 119.97L207.91 119.96L207.9 119.96L207.89 119.95L207.87 119.94L207.86 119.94L207.85 119.93L207.84 119.92L207.83 119.91L207.82 119.9L207.81 119.89L207.8 119.88L207.79 119.87L207.78 119.86L207.77 119.85L207.76 119.84L207.75 119.82L207.75 119.81L207.74 119.8L207.73 119.79L207.73 119.77L207.72 119.76L207.72 119.75L207.71 119.73L207.71 119.72L207.71 119.7L207.7 119.69L207.7 119.68L207.7 119.66L207.7 119.65L207.7 119.63L207.7 112.3L200.37 112.3L200.35 112.3L200.34 112.3L200.32 112.29L200.31 112.29L200.29 112.29L200.28 112.29L200.26 112.28L200.25 112.28L200.24 112.27L200.22 112.27L200.21 112.26L200.2 112.26L200.19 112.25L200.17 112.24L200.16 112.24L200.15 112.23L200.14 112.22L200.13 112.21L200.12 112.2L200.11 112.19L200.1 112.18L200.09 112.17L200.08 112.16L200.07 112.15L200.06 112.14L200.05 112.12L200.05 112.11L200.04 112.1L200.03 112.09L200.03 112.07L200.02 112.06L200.02 112.05L200.01 112.03L200.01 112.02L200.01 112L200 111.99L200 111.98L200 111.96L200 111.95L200 111.93L200 106.06L200 106.05L200 106.03L200 106.02L200 106L200.01 105.99L200.01 105.98L200.01 105.96L200.02 105.95L200.02 105.93L200.03 105.92L200.03 105.91L200.04 105.9L200.05 105.88L200.05 105.87L200.06 105.86L200.07 105.85L200.08 105.84L200.09 105.83L200.1 105.82L200.11 105.81L200.12 105.8L200.13 105.79L200.14 105.78L200.15 105.77L200.16 105.76L200.17 105.75L200.19 105.75L200.2 105.74L200.21 105.73L200.22 105.73L200.24 105.72L200.25 105.72L200.26 105.71L200.28 105.71L200.29 105.71L200.31 105.7L200.32 105.7L200.34 105.7L200.35 105.7L200.37 105.7L207.7 105.7L207.7 98.36L207.7 98.35L207.7 98.33L207.7 98.32L207.7 98.3L207.71 98.29L207.71 98.28L207.71 98.26L207.72 98.25L207.72 98.23L207.73 98.22L207.73 98.21L207.74 98.2L207.75 98.18L207.75 98.17L207.76 98.16L207.77 98.15L207.78 98.14L207.79 98.13L207.8 98.12L207.81 98.11L207.82 98.1L207.83 98.09L207.84 98.08L207.85 98.07L207.86 98.06L207.87 98.05L207.89 98.05L207.9 98.04L207.91 98.03L207.92 98.03L207.94 98.02L207.95 98.02L207.96 98.01L207.98 98.01L207.99 98.01L208.01 98L208.02 98L208.04 98L208.05 98L208.07 98L213.93 98L213.95 98L213.96 98Z";
export const gearIcon =
  "M212.69 10L212.72 10.01L212.74 10.01L212.76 10.01L212.78 10.02L212.79 10.03L212.81 10.04L212.83 10.04L212.85 10.05L212.86 10.06L212.88 10.08L212.9 10.09L212.91 10.1L212.92 10.12L212.94 10.13L212.95 10.15L212.97 10.17L212.98 10.18L212.99 10.2L213.01 10.22L213.02 10.24L213.03 10.26L213.04 10.28L213.05 10.3L213.06 10.33L213.07 10.35L213.08 10.37L213.09 10.4L213.1 10.42L213.11 10.44L213.12 10.47L213.13 10.5L213.14 10.52L213.15 10.55L213.16 10.58L213.17 10.6L213.18 10.63L213.19 10.66L213.2 10.69L213.68 12.47L213.82 12.52L214.15 12.64L214.48 12.76L214.8 12.91L215.11 13.06L215.13 13.07L216.74 12.15L216.76 12.13L216.79 12.12L216.82 12.11L216.84 12.09L216.87 12.08L216.89 12.07L216.92 12.06L216.94 12.05L216.97 12.03L216.99 12.02L217.02 12.01L217.04 12L217.07 12L217.09 11.99L217.11 11.98L217.14 11.97L217.16 11.96L217.18 11.96L217.2 11.95L217.23 11.95L217.25 11.94L217.27 11.94L217.29 11.94L217.31 11.94L217.33 11.94L217.35 11.94L217.37 11.94L217.39 11.94L217.41 11.94L217.43 11.95L217.45 11.95L217.47 11.96L217.49 11.97L217.51 11.97L217.53 11.98L217.54 11.99L217.56 12.01L217.58 12.02L217.6 12.03L217.61 12.05L219.94 14.38L219.96 14.4L219.97 14.42L219.99 14.43L220 14.45L220.01 14.47L220.02 14.49L220.03 14.5L220.04 14.52L220.04 14.54L220.05 14.56L220.05 14.58L220.06 14.6L220.06 14.62L220.06 14.64L220.06 14.67L220.06 14.69L220.06 14.71L220.06 14.73L220.06 14.75L220.05 14.78L220.05 14.8L220.04 14.82L220.04 14.84L220.03 14.87L220.03 14.89L220.02 14.92L220.01 14.94L220 14.96L219.99 14.99L219.98 15.01L219.97 15.04L219.96 15.06L219.95 15.08L219.93 15.11L219.92 15.13L219.91 15.16L219.89 15.18L219.88 15.21L219.86 15.23L219.85 15.26L218.92 16.86L218.94 16.89L219.09 17.2L219.24 17.52L219.36 17.85L219.48 18.18L219.53 18.32L221.31 18.8L221.34 18.81L221.37 18.81L221.4 18.82L221.42 18.83L221.45 18.84L221.48 18.84L221.5 18.85L221.53 18.86L221.56 18.87L221.58 18.88L221.6 18.89L221.63 18.9L221.65 18.91L221.67 18.92L221.7 18.93L221.72 18.94L221.74 18.96L221.76 18.97L221.78 18.98L221.8 18.99L221.82 19.01L221.83 19.02L221.85 19.04L221.87 19.05L221.88 19.07L221.9 19.08L221.91 19.1L221.92 19.11L221.94 19.13L221.95 19.15L221.96 19.17L221.96 19.18L221.97 19.2L221.98 19.22L221.99 19.24L221.99 19.26L221.99 19.28L222 19.31L222 19.33L222 19.35L222 22.65L222 22.67L222 22.69L221.99 22.72L221.99 22.74L221.99 22.76L221.98 22.78L221.97 22.79L221.96 22.81L221.96 22.83L221.95 22.85L221.94 22.86L221.92 22.88L221.91 22.9L221.9 22.91L221.88 22.92L221.87 22.94L221.85 22.95L221.83 22.97L221.82 22.98L221.8 22.99L221.78 23.01L221.76 23.02L221.74 23.03L221.72 23.04L221.7 23.05L221.67 23.06L221.65 23.07L221.63 23.08L221.6 23.09L221.58 23.1L221.56 23.11L221.53 23.12L221.5 23.13L221.48 23.14L221.45 23.15L221.42 23.16L221.4 23.17L221.37 23.18L221.34 23.19L221.31 23.2L219.53 23.68L219.48 23.82L219.36 24.15L219.24 24.48L219.09 24.8L218.94 25.11L218.92 25.14L219.85 26.74L219.86 26.76L219.88 26.79L219.89 26.81L219.91 26.84L219.92 26.86L219.93 26.88L219.95 26.91L219.96 26.93L219.97 26.96L219.98 26.98L219.99 27.01L220 27.03L220.01 27.05L220.02 27.08L220.03 27.1L220.03 27.13L220.04 27.15L220.04 27.17L220.05 27.19L220.05 27.22L220.06 27.24L220.06 27.26L220.06 27.28L220.06 27.31L220.06 27.33L220.06 27.35L220.06 27.37L220.06 27.39L220.05 27.41L220.05 27.43L220.04 27.45L220.04 27.47L220.03 27.49L220.02 27.51L220.01 27.53L220 27.54L219.99 27.56L219.97 27.58L219.96 27.6L219.94 27.61L217.61 29.94L217.6 29.96L217.58 29.97L217.56 29.99L217.54 30L217.53 30.01L217.51 30.02L217.49 30.03L217.47 30.03L217.45 30.04L217.43 30.05L217.41 30.05L217.39 30.05L217.37 30.05L217.35 30.06L217.33 30.06L217.31 30.06L217.29 30.05L217.27 30.05L217.25 30.05L217.23 30.04L217.2 30.04L217.18 30.03L217.16 30.03L217.14 30.02L217.11 30.01L217.09 30.01L217.07 30L217.04 29.99L217.02 29.98L216.99 29.97L216.97 29.96L216.94 29.95L216.92 29.94L216.89 29.92L216.87 29.91L216.84 29.9L216.82 29.89L216.79 29.87L216.76 29.86L216.74 29.85L215.14 28.92L215.11 28.94L214.8 29.09L214.48 29.24L214.15 29.36L213.82 29.48L213.68 29.53L213.2 31.31L213.19 31.34L213.18 31.37L213.17 31.4L213.16 31.42L213.15 31.45L213.14 31.48L213.13 31.5L213.12 31.53L213.11 31.56L213.1 31.58L213.09 31.6L213.08 31.63L213.07 31.65L213.06 31.67L213.05 31.7L213.04 31.72L213.03 31.74L213.02 31.76L213.01 31.78L212.99 31.8L212.98 31.82L212.97 31.83L212.95 31.85L212.94 31.87L212.92 31.88L212.91 31.9L212.9 31.91L212.88 31.92L212.86 31.94L212.85 31.95L212.83 31.96L212.81 31.96L212.79 31.97L212.78 31.98L212.76 31.99L212.74 31.99L212.72 31.99L212.69 32L212.67 32L212.65 32L209.35 32L209.33 32L209.31 32L209.28 31.99L209.26 31.99L209.24 31.99L209.22 31.98L209.2 31.97L209.18 31.96L209.17 31.96L209.15 31.95L209.13 31.94L209.11 31.92L209.1 31.91L209.08 31.9L209.07 31.88L209.05 31.87L209.04 31.85L209.02 31.83L209.01 31.82L208.99 31.8L208.98 31.78L208.97 31.76L208.96 31.74L208.94 31.72L208.93 31.7L208.92 31.67L208.91 31.65L208.9 31.63L208.89 31.6L208.88 31.58L208.87 31.56L208.86 31.53L208.85 31.5L208.84 31.48L208.84 31.45L208.83 31.42L208.82 31.4L208.81 31.37L208.81 31.34L208.8 31.31L208.32 29.53L208.18 29.48L207.85 29.36L207.52 29.24L207.2 29.09L206.89 28.94L206.86 28.92L205.26 29.84L205.24 29.86L205.21 29.87L205.19 29.89L205.16 29.9L205.14 29.91L205.12 29.93L205.09 29.94L205.07 29.95L205.04 29.96L205.02 29.97L204.99 29.98L204.97 29.99L204.95 30L204.92 30.01L204.9 30.02L204.87 30.03L204.85 30.03L204.83 30.04L204.81 30.04L204.78 30.05L204.76 30.05L204.74 30.05L204.72 30.06L204.69 30.06L204.67 30.06L204.65 30.06L204.63 30.05L204.61 30.05L204.59 30.05L204.57 30.04L204.55 30.04L204.53 30.03L204.51 30.02L204.49 30.01L204.47 30L204.46 29.99L204.44 29.98L204.42 29.97L204.4 29.95L204.39 29.94L202.06 27.6L202.04 27.59L202.03 27.57L202.01 27.56L202 27.54L201.99 27.52L201.98 27.5L201.97 27.48L201.97 27.47L201.96 27.45L201.95 27.43L201.95 27.41L201.95 27.39L201.95 27.37L201.94 27.35L201.94 27.33L201.94 27.31L201.95 27.29L201.95 27.26L201.95 27.24L201.96 27.22L201.96 27.2L201.97 27.18L201.97 27.15L201.98 27.13L201.99 27.11L201.99 27.08L202 27.06L202.01 27.04L202.02 27.01L202.03 26.99L202.04 26.96L202.05 26.94L202.06 26.91L202.08 26.89L202.09 26.86L202.1 26.83L202.11 26.81L202.13 26.78L202.14 26.76L202.15 26.73L203.08 25.14L203.06 25.11L202.91 24.8L202.76 24.48L202.64 24.15L202.52 23.82L202.47 23.68L200.69 23.2L200.66 23.19L200.63 23.18L200.6 23.17L200.58 23.16L200.55 23.15L200.52 23.14L200.5 23.13L200.47 23.12L200.44 23.11L200.42 23.1L200.4 23.09L200.37 23.08L200.35 23.07L200.33 23.06L200.3 23.05L200.28 23.04L200.26 23.03L200.24 23.02L200.22 23.01L200.2 22.99L200.18 22.98L200.17 22.97L200.15 22.95L200.13 22.94L200.12 22.92L200.1 22.91L200.09 22.9L200.08 22.88L200.06 22.86L200.05 22.85L200.04 22.83L200.04 22.81L200.03 22.79L200.02 22.78L200.01 22.76L200.01 22.74L200.01 22.72L200 22.69L200 22.67L200 22.65L200 19.35L200 19.33L200 19.31L200.01 19.28L200.01 19.26L200.01 19.24L200.02 19.22L200.03 19.2L200.04 19.18L200.04 19.17L200.05 19.15L200.06 19.13L200.08 19.11L200.09 19.1L200.1 19.08L200.12 19.07L200.13 19.05L200.15 19.04L200.17 19.02L200.18 19.01L200.2 18.99L200.22 18.98L200.24 18.97L200.26 18.96L200.28 18.94L200.3 18.93L200.33 18.92L200.35 18.91L200.37 18.9L200.4 18.89L200.42 18.88L200.44 18.87L200.47 18.86L200.5 18.85L200.52 18.84L200.55 18.84L200.58 18.83L200.6 18.82L200.63 18.81L200.66 18.81L200.69 18.8L202.47 18.32L202.52 18.18L202.64 17.85L202.76 17.52L202.91 17.2L203.06 16.89L203.08 16.86L202.15 15.26L202.14 15.24L202.13 15.21L202.11 15.18L202.1 15.16L202.09 15.13L202.08 15.11L202.06 15.08L202.05 15.06L202.04 15.03L202.03 15.01L202.02 14.98L202.01 14.96L202 14.93L201.99 14.91L201.99 14.89L201.98 14.86L201.97 14.84L201.97 14.82L201.96 14.8L201.96 14.77L201.95 14.75L201.95 14.73L201.95 14.71L201.94 14.69L201.94 14.67L201.94 14.65L201.95 14.63L201.95 14.61L201.95 14.59L201.95 14.57L201.96 14.55L201.97 14.53L201.97 14.51L201.98 14.49L201.99 14.47L202 14.46L202.01 14.44L202.03 14.42L202.04 14.4L202.06 14.39L204.39 12.06L204.4 12.04L204.42 12.03L204.44 12.01L204.46 12L204.47 11.99L204.49 11.98L204.51 11.97L204.53 11.96L204.55 11.96L204.57 11.95L204.59 11.95L204.61 11.94L204.63 11.94L204.65 11.94L204.67 11.94L204.69 11.94L204.72 11.94L204.74 11.94L204.76 11.94L204.78 11.95L204.81 11.95L204.83 11.96L204.85 11.96L204.87 11.97L204.9 11.97L204.92 11.98L204.95 11.99L204.97 12L204.99 12.01L205.02 12.02L205.04 12.03L205.07 12.04L205.09 12.05L205.12 12.07L205.14 12.08L205.16 12.09L205.19 12.11L205.21 12.12L205.24 12.14L205.26 12.15L206.86 13.08L206.89 13.06L207.2 12.91L207.52 12.76L207.85 12.64L208.18 12.52L208.32 12.47L208.8 10.69L208.81 10.66L208.81 10.63L208.82 10.6L208.83 10.58L208.84 10.55L208.84 10.52L208.85 10.5L208.86 10.47L208.87 10.44L208.88 10.42L208.89 10.4L208.9 10.37L208.91 10.35L208.92 10.33L208.93 10.3L208.94 10.28L208.96 10.26L208.97 10.24L208.98 10.22L208.99 10.2L209.01 10.18L209.02 10.17L209.04 10.15L209.05 10.13L209.07 10.12L209.08 10.1L209.1 10.09L209.11 10.08L209.13 10.06L209.15 10.05L209.17 10.04L209.18 10.04L209.2 10.03L209.22 10.02L209.24 10.01L209.26 10.01L209.28 10.01L209.31 10L209.33 10L209.35 10L212.65 10L212.67 10L212.69 10ZM210.61 16.2L210.41 16.22L210.22 16.25L210.03 16.29L209.84 16.33L209.66 16.38L209.48 16.43L209.3 16.5L209.13 16.57L208.96 16.64L208.79 16.72L208.62 16.81L208.46 16.91L208.31 17.01L208.16 17.12L208.01 17.23L207.87 17.35L207.73 17.47L207.6 17.6L207.47 17.73L207.35 17.87L207.23 18.01L207.12 18.16L207.01 18.31L206.91 18.46L206.81 18.62L206.72 18.79L206.64 18.96L206.57 19.13L206.5 19.3L206.43 19.48L206.38 19.66L206.33 19.84L206.29 20.03L206.25 20.22L206.22 20.41L206.2 20.61L206.19 20.8L206.19 21L206.19 21.2L206.2 21.39L206.22 21.59L206.25 21.78L206.29 21.97L206.33 22.16L206.38 22.34L206.43 22.52L206.5 22.7L206.57 22.87L206.64 23.04L206.72 23.21L206.81 23.38L206.91 23.54L207.01 23.69L207.12 23.84L207.23 23.99L207.35 24.13L207.47 24.27L207.6 24.4L207.73 24.53L207.87 24.65L208.01 24.77L208.16 24.88L208.31 24.99L208.46 25.09L208.62 25.19L208.79 25.28L208.96 25.36L209.13 25.43L209.3 25.5L209.48 25.57L209.66 25.62L209.84 25.67L210.03 25.71L210.22 25.75L210.41 25.78L210.61 25.8L210.8 25.81L211 25.81L211.2 25.81L211.39 25.8L211.59 25.78L211.78 25.75L211.97 25.71L212.16 25.67L212.34 25.62L212.52 25.57L212.7 25.5L212.87 25.43L213.04 25.36L213.21 25.28L213.38 25.19L213.54 25.09L213.69 24.99L213.84 24.88L213.99 24.77L214.13 24.65L214.27 24.53L214.4 24.4L214.53 24.27L214.65 24.13L214.77 23.99L214.88 23.84L214.99 23.69L215.09 23.54L215.19 23.38L215.28 23.21L215.36 23.04L215.43 22.87L215.5 22.7L215.57 22.52L215.62 22.34L215.67 22.16L215.71 21.97L215.75 21.78L215.78 21.59L215.8 21.39L215.81 21.2L215.81 21L215.81 20.8L215.8 20.61L215.78 20.41L215.75 20.22L215.71 20.03L215.67 19.84L215.62 19.66L215.57 19.48L215.5 19.3L215.43 19.13L215.36 18.96L215.28 18.79L215.19 18.62L215.09 18.46L214.99 18.31L214.88 18.16L214.77 18.01L214.65 17.87L214.53 17.73L214.4 17.6L214.27 17.47L214.13 17.35L213.99 17.23L213.84 17.12L213.69 17.01L213.54 16.91L213.38 16.81L213.21 16.72L213.04 16.64L212.87 16.57L212.7 16.5L212.52 16.43L212.34 16.38L212.16 16.33L211.97 16.29L211.78 16.25L211.59 16.22L211.39 16.2L211.2 16.19L211 16.19L210.8 16.19L210.61 16.2Z";
