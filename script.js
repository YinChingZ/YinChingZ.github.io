const heartElement = document.getElementById('heart');
const heartPattern = [
    "  *****     *****  ",
    "********* *********",
    "*******************",
    " ***************** ",
    "  ***************  ",
    "    ***********    ",
    "      *******      ",
    "        ***        ",
    "         *         "
];

let angle = 0;

function rotateHeart() {
    const rad = angle * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rotatedHeart = heartPattern.map((line, y) => {
        return line.split('').map((char, x) => {
            const newX = Math.round(x * cos - y * sin);
            const newY = Math.round(x * sin + y * cos);
            return getHeartChar(newX, newY);
        }).join('');
    }).join('\n');

    heartElement.textContent = rotatedHeart;
    angle = (angle + 1) % 360;
}

function getHeartChar(x, y) {
    const centerX = Math.floor(heartPattern[0].length / 2);
    const centerY = Math.floor(heartPattern.length / 2);
    const adjustedX = x + centerX;
    const adjustedY = y + centerY;

    if (adjustedY >= 0 && adjustedY < heartPattern.length && adjustedX >= 0 && adjustedX < heartPattern[0].length) {
        return heartPattern[adjustedY][adjustedX];
    }
    return ' ';
}

setInterval(rotateHeart, 100);
