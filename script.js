const canvas = document.getElementById('canvas');

let A = 0;
const width = 80; // Increase width for higher resolution
const height = 44; // Increase height for higher resolution
let zBuffer = new Array(width * height);
let buffer = new Array(width * height);
const distanceFromCam = 100;
const K1 = 60; // Adjust scaling factor for better fit
const incrementSpeed = 0.05;

function initializeBuffers() {
    for (let i = 0; i < width * height; i++) {
        zBuffer[i] = 0;
        buffer[i] = ' ';
    }
}

function calculateX(u, v) {
    return 16 * Math.sin(u) ** 3;
}

function calculateY(u, v) {
    return -(13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)); // Flip the y-axis
}

function calculateZ(u, v) {
    return 4 * Math.sin(v); // Adding thickness to the heart shape
}

function rotateX(x, y, z, A) {
    return x * Math.cos(A) - z * Math.sin(A); // Rotate around y-axis to keep vertical direction
}

function rotateY(x, y, z) {
    return y; // Keep y-axis unchanged to maintain vertical direction
}

function rotateZ(x, y, z, A) {
    return z * Math.cos(A) + x * Math.sin(A); // Rotate around y-axis to keep vertical direction
}

function drawHeart() {
    initializeBuffers();
    let u = -Math.PI;
    while (u < Math.PI) {
        let v = -Math.PI;
        while (v < Math.PI) {
            let x = calculateX(u, v);
            let y = calculateY(u, v);
            let z = calculateZ(u, v);

            // Apply rotations
            let xRot = rotateX(x, y, z, A);
            let yRot = rotateY(x, y, z);
            let zRot = rotateZ(x, y, z, A) + distanceFromCam;

            let ooz = 1 / zRot;
            let xp = Math.floor(width / 2 + K1 * ooz * xRot);
            let yp = Math.floor(height / 2 + K1 * ooz * yRot);

            let idx = xp + yp * width;
            if (idx >= 0 && idx < width * height) {
                if (ooz > zBuffer[idx]) {
                    zBuffer[idx] = ooz;
                    buffer[idx] = '@';
                }
            }

            v += incrementSpeed;
        }
        u += incrementSpeed;
    }

    // Join buffer into a string and set it as the content of the pre element
    let output = "";
    for (let i = 0; i < height; i++) {
        output += buffer.slice(i * width, (i + 1) * width).join('') + '\n';
    }
    canvas.textContent = output;

    A += 0.05;
    requestAnimationFrame(drawHeart);
}

drawHeart();
