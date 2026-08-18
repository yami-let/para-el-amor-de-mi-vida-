/* =========================================
   GALAXIA 3D
   ESTRELLAS + CORAZONES
========================================= */

const contenedor = document.querySelector(".estrellas");

const canvas = document.createElement("canvas");
contenedor.appendChild(canvas);

const ctx = canvas.getContext("2d");

let ancho;
let alto;

let centroX;
let centroY;

const cantidad = 260;
const profundidadMaxima = 1800;

const objetos = [];


/* =========================================
   CANVAS
========================================= */

function ajustarCanvas() {

    ancho = window.innerWidth;
    alto = window.innerHeight;

    centroX = ancho / 2;
    centroY = alto / 2;

    canvas.width = ancho;
    canvas.height = alto;
}

ajustarCanvas();

window.addEventListener(
    "resize",
    ajustarCanvas
);


/* =========================================
   CREAR OBJETOS
========================================= */

for (let i = 0; i < cantidad; i++) {

    objetos.push(crearObjeto());
}


function crearObjeto() {

    const angulo =
        Math.random() * Math.PI * 2;

    const distancia =
        Math.pow(Math.random(), .7) *
        Math.max(ancho, alto) *
        .75;

    return {

        x:
            Math.cos(angulo) *
            distancia,

        y:
            Math.sin(angulo) *
            distancia,

        z:
            Math.random() *
            profundidadMaxima,

        velocidad:
            Math.random() * 4 + 1,

        tamaño:
            Math.random() * 1.8 + .6,

        brillo:
            Math.random() * .7 + .3,

        esCorazon:
            Math.random() < .35
    };
}


/* =========================================
   REINICIAR OBJETO
========================================= */

function reiniciarObjeto(objeto) {

    const angulo =
        Math.random() * Math.PI * 2;

    const distancia =
        Math.pow(Math.random(), .7) *
        Math.max(ancho, alto) *
        .75;

    objeto.x =
        Math.cos(angulo) * distancia;

    objeto.y =
        Math.sin(angulo) * distancia;

    objeto.z =
        profundidadMaxima;

    objeto.velocidad =
        Math.random() * 4 + 1;

    objeto.tamaño =
        Math.random() * 1.8 + .6;

    objeto.brillo =
        Math.random() * .7 + .3;

    objeto.esCorazon =
        Math.random() < .35;
}


/* =========================================
   DIBUJAR CORAZÓN
========================================= */

function dibujarCorazon(
    x,
    y,
    tamaño,
    opacidad
) {

    ctx.save();

    ctx.translate(x, y);

    ctx.scale(
        tamaño,
        tamaño
    );

    ctx.beginPath();

    ctx.moveTo(0, 0.3);

    ctx.bezierCurveTo(
        -1.8, -1.2,
        -3.2, 0.5,
        0, 3
    );

    ctx.bezierCurveTo(
        3.2, 0.5,
        1.8, -1.2,
        0, 0.3
    );

    ctx.closePath();

    ctx.fillStyle =
        `rgba(
            255,
            70,
            190,
            ${opacidad}
        )`;

    ctx.shadowBlur =
        Math.max(4, tamaño * 4);

    ctx.shadowColor =
        "rgba(255,60,210,.8)";

    ctx.fill();

    ctx.restore();
}


/* =========================================
   DIBUJAR ESTRELLA
========================================= */

function dibujarEstrella(
    x,
    y,
    tamaño,
    opacidad,
    violeta
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        Math.max(.5, tamaño),
        0,
        Math.PI * 2
    );

    ctx.fillStyle = violeta

        ? `rgba(
            235,
            190,
            255,
            ${opacidad}
        )`

        : `rgba(
            255,
            255,
            255,
            ${opacidad}
        )`;

    ctx.fill();
}


/* =========================================
   ANIMACIÓN 3D
========================================= */

function animar() {

    ctx.clearRect(
        0,
        0,
        ancho,
        alto
    );

    for (const objeto of objetos) {

        /*
           Las estrellas y corazones
           vienen hacia nosotros
        */

        objeto.z -=
            objeto.velocidad;


        /*
           Cuando llegan al frente,
           vuelven al fondo
        */

        if (objeto.z <= 1) {

            reiniciarObjeto(objeto);

            continue;
        }


        /*
           PROYECCIÓN 3D
        */

        const escala =
            700 / objeto.z;

        const pantallaX =
            centroX +
            objeto.x * escala;

        const pantallaY =
            centroY +
            objeto.y * escala;


        /*
           Tamaño según profundidad
        */

        const tamaño =
            objeto.tamaño * escala;


        /*
           Si sale de la pantalla
        */

        if (
            pantallaX < -150 ||
            pantallaX > ancho + 150 ||
            pantallaY < -150 ||
            pantallaY > alto + 150
        ) {

            reiniciarObjeto(objeto);

            continue;
        }


        /*
           Brillo
        */

        const opacidad =
            Math.min(
                1,
                objeto.brillo *
                (1 + escala * .35)
            );


        /* =================================
           CORAZÓN
        ================================= */

        if (objeto.esCorazon) {

            dibujarCorazon(
                pantallaX,
                pantallaY,
                Math.max(
                    .8,
                    tamaño * 2.2
                ),
                opacidad
            );

        }


        /* =================================
           ESTRELLA
        ================================= */

        else {

            dibujarEstrella(
                pantallaX,
                pantallaY,
                tamaño,
                opacidad,
                objeto.brillo > .82
            );
        }


        /* =================================
           ESTELA 3D
        ================================= */

        if (escala > 1.4) {

            ctx.beginPath();

            ctx.moveTo(
                pantallaX,
                pantallaY
            );

            ctx.lineTo(
                centroX +
                objeto.x *
                (escala * .82),

                centroY +
                objeto.y *
                (escala * .82)
            );

            ctx.strokeStyle =
                objeto.esCorazon

                    ? `rgba(
                        255,
                        70,
                        200,
                        ${opacidad * .18}
                    )`

                    : `rgba(
                        220,
                        190,
                        255,
                        ${opacidad * .18}
                    )`;

            ctx.lineWidth =
                Math.min(
                    2,
                    tamaño * .5
                );

            ctx.stroke();
        }
    }

    requestAnimationFrame(animar);
}

animar();


/* =========================================
   MENSAJE AL TOCAR LA FOTO
========================================= */

const foto =
    document.querySelector(".marco-foto");

const tarjeta =
    document.querySelector(".tarjeta");

const mensaje =
    document.createElement("div");

mensaje.className =
    "mensaje-amor";

mensaje.textContent =
    "Te amo mucho, mi niña ❤️";

tarjeta.appendChild(mensaje);


/* =========================================
   TOCAR FOTO
========================================= */

if (foto) {

    foto.addEventListener(
        "click",
        function () {

            mensaje.classList.toggle(
                "mostrar"
            );

        }
    );
}


/* =========================================
   BOTÓN HELLO KITTY
========================================= */

const botonEntrar =
    document.getElementById("entrar");

if (botonEntrar) {

    botonEntrar.addEventListener(
        "click",
        function () {

            alert(
                "❤️ Continuará..."
            );

        }
    );
}


/* =========================================
   LIQUID GLASS 3D
   PC + CELULAR
========================================= */

let rotacionX = 0;
let rotacionY = 0;

let objetivoX = 0;
let objetivoY = 0;


/* =========================================
   MOUSE - COMPUTADORA
========================================= */

document.addEventListener(
    "mousemove",
    function (e) {

        /*
           Si es un dispositivo táctil,
           no usamos el mouse.
        */

        if (
            "ontouchstart" in window
        ) {
            return;
        }


        const x =
            e.clientX /
            window.innerWidth -
            0.5;

        const y =
            e.clientY /
            window.innerHeight -
            0.5;


        /*
           Inclinación suave
        */

        objetivoY =
            x * 10;

        objetivoX =
            -y * 10;
    }
);


/* =========================================
   DEDO - CELULAR
========================================= */

document.addEventListener(
    "touchmove",
    function (e) {

        if (!e.touches.length) {
            return;
        }

        const toque =
            e.touches[0];


        const x =
            toque.clientX /
            window.innerWidth -
            0.5;

        const y =
            toque.clientY /
            window.innerHeight -
            0.5;


        /*
           Movimiento más pequeño
           para celular
        */

        objetivoY =
            x * 8;

        objetivoX =
            -y * 8;

    },
    {
        passive: true
    }
);


/* =========================================
   SOLTAR EL DEDO
========================================= */

document.addEventListener(
    "touchend",
    function () {

        objetivoX = 0;
        objetivoY = 0;

    }
);


/* =========================================
   ANIMACIÓN DEL CRISTAL
========================================= */

function moverTarjeta3D() {

    /*
       Movimiento suave
    */

    rotacionX +=
        (objetivoX - rotacionX) *
        0.08;

    rotacionY +=
        (objetivoY - rotacionY) *
        0.08;


    /*
       Aplicar perspectiva 3D
    */

    tarjeta.style.transform =
        `perspective(900px)
         rotateX(${rotacionX}deg)
         rotateY(${rotacionY}deg)`;


    requestAnimationFrame(
        moverTarjeta3D
    );
}

moverTarjeta3D();