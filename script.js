/* =========================================
   GALAXIA 3D - PRIMERA ESCENA
========================================= */

const contenedor = document.querySelector(".estrellas");

const canvas = document.createElement("canvas");

if (contenedor) {
    contenedor.appendChild(canvas);
}

const ctx = canvas.getContext("2d");

let ancho = window.innerWidth;
let alto = window.innerHeight;

let centroX = ancho / 2;
let centroY = alto / 2;

const cantidad = 320;
const profundidadMaxima = 1800;

const objetos = [];

let velocidadExtra = 0;
let viajando = false;


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

window.addEventListener("resize", ajustarCanvas);


/* =========================================
   CREAR OBJETOS 3D
========================================= */

function crearObjeto() {

    const angulo =
        Math.random() * Math.PI * 2;

    const distancia =
        Math.pow(Math.random(), .65) *
        Math.max(ancho, alto) *
        .9;

    return {

        x: Math.cos(angulo) * distancia,

        y: Math.sin(angulo) * distancia,

        z: Math.random() * profundidadMaxima,

        velocidad:
            Math.random() * 4 + 1,

        tamaño:
            Math.random() * 1.8 + .6,

        brillo:
            Math.random() * .7 + .3,

        esCorazon:
            Math.random() < .30
    };
}


/* =========================================
   CREAR ESTRELLAS
========================================= */

for (let i = 0; i < cantidad; i++) {
    objetos.push(crearObjeto());
}


/* =========================================
   REINICIAR
========================================= */

function reiniciarObjeto(objeto) {

    const nuevo = crearObjeto();

    objeto.x = nuevo.x;
    objeto.y = nuevo.y;
    objeto.z = profundidadMaxima;

    objeto.velocidad = nuevo.velocidad;
    objeto.tamaño = nuevo.tamaño;
    objeto.brillo = nuevo.brillo;
    objeto.esCorazon = nuevo.esCorazon;
}


/* =========================================
   CORAZÓN PEQUEÑO
========================================= */

function dibujarCorazon(x, y, tamaño, opacidad) {

    ctx.save();

    ctx.translate(x, y);

    ctx.scale(tamaño, tamaño);

    ctx.beginPath();

    ctx.moveTo(0, .3);

    ctx.bezierCurveTo(
        -1.8, -1.2,
        -3.2, .5,
        0, 3
    );

    ctx.bezierCurveTo(
        3.2, .5,
        1.8, -1.2,
        0, .3
    );

    ctx.closePath();

    ctx.fillStyle =
        `rgba(255,70,190,${opacidad})`;

    ctx.shadowBlur =
        Math.max(4, tamaño * 4);

    ctx.shadowColor =
        "rgba(255,40,180,.9)";

    ctx.fill();

    ctx.restore();
}


/* =========================================
   ESTRELLA
========================================= */

function dibujarEstrella(
    x,
    y,
    tamaño,
    opacidad
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        Math.max(.5, tamaño),
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        `rgba(255,255,255,${opacidad})`;

    ctx.shadowBlur =
        tamaño > 2 ? 8 : 0;

    ctx.shadowColor =
        "#e8b7ff";

    ctx.fill();
}


/* =========================================
   ANIMACIÓN 3D
========================================= */

function animarEspacio() {

    ctx.clearRect(
        0,
        0,
        ancho,
        alto
    );

    for (const objeto of objetos) {

        objeto.z -=
            objeto.velocidad +
            velocidadExtra;

        if (objeto.z <= 1) {

            reiniciarObjeto(objeto);

            continue;
        }

        const escala =
            700 / objeto.z;

        const pantallaX =
            centroX +
            objeto.x * escala;

        const pantallaY =
            centroY +
            objeto.y * escala;

        const tamaño =
            objeto.tamaño * escala;

        if (
            pantallaX < -200 ||
            pantallaX > ancho + 200 ||
            pantallaY < -200 ||
            pantallaY > alto + 200
        ) {

            reiniciarObjeto(objeto);

            continue;
        }

        const opacidad =
            Math.min(
                1,
                objeto.brillo *
                (1 + escala * .35)
            );


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

        } else {

            dibujarEstrella(
                pantallaX,
                pantallaY,
                tamaño,
                opacidad
            );
        }


        /* ESTELA */

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

    requestAnimationFrame(animarEspacio);
}

animarEspacio();


/* =========================================
   MENSAJE AL TOCAR LA FOTO
========================================= */

const foto =
    document.querySelector(".marco-foto");

const tarjeta =
    document.querySelector(".tarjeta");

let mensaje =
    document.querySelector(".mensaje-amor");

if (!mensaje) {

    mensaje =
        document.createElement("div");

    mensaje.className =
        "mensaje-amor";

    mensaje.textContent =
        "Te amo mucho, mi niña ❤️";

    if (tarjeta) {
        tarjeta.appendChild(mensaje);
    }
}

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
   EFECTO 3D DEL LIQUID GLASS
========================================= */

let rotacionX = 0;
let rotacionY = 0;

let objetivoX = 0;
let objetivoY = 0;


/* PC */

document.addEventListener(
    "mousemove",
    function (e) {

        const x =
            e.clientX /
            window.innerWidth -
            .5;

        const y =
            e.clientY /
            window.innerHeight -
            .5;

        objetivoY = x * 10;
        objetivoX = -y * 10;
    }
);


/* CELULAR */

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
            .5;

        const y =
            toque.clientY /
            window.innerHeight -
            .5;

        objetivoY = x * 8;
        objetivoX = -y * 8;

    },
    {
        passive: true
    }
);


/* CENTRAR AL SOLTAR */

document.addEventListener(
    "touchend",
    function () {

        objetivoX = 0;
        objetivoY = 0;

    }
);


/* =========================================
   ANIMAR TARJETA
========================================= */

function moverTarjeta3D() {

    if (tarjeta) {

        rotacionX +=
            (objetivoX - rotacionX) * .08;

        rotacionY +=
            (objetivoY - rotacionY) * .08;

        tarjeta.style.transform =
            `perspective(900px)
             rotateX(${rotacionX}deg)
             rotateY(${rotacionY}deg)`;
    }

    requestAnimationFrame(
        moverTarjeta3D
    );
}

moverTarjeta3D();


/* =========================================
   SEGUNDA ESCENA
========================================= */

const segundaEscena =
    document.getElementById("llegamos");

const canvasCorazon =
    document.getElementById("corazonGalaxia");

let ctxCorazon = null;

if (canvasCorazon) {

    ctxCorazon =
        canvasCorazon.getContext("2d");
}


/* =========================================
   GALAXIA CORAZÓN ❤️
========================================= */

let anchoCorazon =
    window.innerWidth;

let altoCorazon =
    window.innerHeight;


/*
   MUCHÍSIMAS ESTRELLAS
*/

const cantidadCorazon = 1500;

const estrellasCorazon = [];


/* =========================================
   AJUSTAR CANVAS
========================================= */

function ajustarCorazon() {

    if (!canvasCorazon) {
        return;
    }

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    anchoCorazon =
        window.innerWidth;

    altoCorazon =
        window.innerHeight;

    canvasCorazon.width =
        anchoCorazon * dpr;

    canvasCorazon.height =
        altoCorazon * dpr;

    canvasCorazon.style.width =
        anchoCorazon + "px";

    canvasCorazon.style.height =
        altoCorazon + "px";

    ctxCorazon.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}

ajustarCorazon();

window.addEventListener(
    "resize",
    ajustarCorazon
);


/* =========================================
   CREAR ESTRELLA DEL CORAZÓN
========================================= */

function crearEstrellaCorazon() {

    /*
       Ecuación del corazón
    */

    const t =
        Math.random() *
        Math.PI * 2;

    const profundidad =
        Math.pow(
            Math.random(),
            .45
        );


    let x =
        16 *
        Math.pow(
            Math.sin(t),
            3
        );

    let y =
        13 * Math.cos(t)
        -
        5 * Math.cos(2 * t)
        -
        2 * Math.cos(3 * t)
        -
        Math.cos(4 * t);


    /*
       ESCALA DEL CORAZÓN
    */

    const escala =
        Math.min(
            anchoCorazon,
            altoCorazon
        ) / 34;


    /*
       Meter estrellas
       dentro del corazón
    */

    x *=
        escala *
        profundidad;

    y *=
        escala *
        profundidad;


    return {

        x: x,

        y: -y,

        z:
            Math.random() *
            1400,

        tamaño:
            Math.random() *
            2.2 + .5,

        brillo:
            Math.random() *
            .75 + .25,

        velocidad:
            Math.random() *
            1.4 + .3,

        parpadeo:
            Math.random() *
            Math.PI * 2
    };
}


/* =========================================
   CREAR 1500 ESTRELLAS
========================================= */

for (
    let i = 0;
    i < cantidadCorazon;
    i++
) {

    estrellasCorazon.push(
        crearEstrellaCorazon()
    );
}


/* =========================================
   ESTRELLA ROJA
========================================= */

function dibujarEstrellaRoja(
    x,
    y,
    tamaño,
    opacidad
) {

    ctxCorazon.save();

    ctxCorazon.beginPath();

    ctxCorazon.arc(
        x,
        y,
        Math.max(
            .5,
            tamaño
        ),
        0,
        Math.PI * 2
    );

    ctxCorazon.fillStyle =
        `rgba(
            255,
            45,
            75,
            ${opacidad}
        )`;

    ctxCorazon.shadowBlur =
        Math.min(
            18,
            tamaño * 6
        );

    ctxCorazon.shadowColor =
        "rgba(255,0,50,.95)";

    ctxCorazon.fill();

    ctxCorazon.restore();
}


/* =========================================
   ANIMAR GALAXIA CORAZÓN
========================================= */

function animarCorazon() {

    if (
        !ctxCorazon ||
        !canvasCorazon
    ) {

        requestAnimationFrame(
            animarCorazon
        );

        return;
    }


    ctxCorazon.clearRect(
        0,
        0,
        anchoCorazon,
        altoCorazon
    );


    const cx =
        anchoCorazon / 2;

    const cy =
        altoCorazon / 2;


    /* =====================================
       NEBULOSA ROJA DETRÁS
    ===================================== */

    const nebulosa =
        ctxCorazon.createRadialGradient(
            cx,
            cy,
            20,
            cx,
            cy,
            Math.min(
                anchoCorazon,
                altoCorazon
            ) * .55
        );

    nebulosa.addColorStop(
        0,
        "rgba(255,0,50,.20)"
    );

    nebulosa.addColorStop(
        .25,
        "rgba(180,0,70,.14)"
    );

    nebulosa.addColorStop(
        .55,
        "rgba(100,0,60,.08)"
    );

    nebulosa.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctxCorazon.fillStyle =
        nebulosa;

    ctxCorazon.fillRect(
        0,
        0,
        anchoCorazon,
        altoCorazon
    );


    /* =====================================
       ESTRELLAS
    ===================================== */

    const tiempo =
        performance.now() * .001;


    for (
        const estrella
        of estrellasCorazon
    ) {

        /*
           VIAJE 3D
        */

        estrella.z -=
            estrella.velocidad;


        if (estrella.z <= 1) {

            estrella.z = 1400;

            continue;
        }


        /*
           PERSPECTIVA
        */

        const perspectiva =
            700 /
            estrella.z;


        const x =
            cx +
            estrella.x *
            perspectiva;


        const y =
            cy +
            estrella.y *
            perspectiva;


        const tamaño =
            estrella.tamaño *
            perspectiva;


        /*
           PARPADEO
        */

        const brillo =
            estrella.brillo *
            (
                .65 +
                Math.sin(
                    tiempo * 3 +
                    estrella.parpadeo
                ) * .35
            );


        /*
           ESTELA
        */

        if (
            perspectiva > 1.35
        ) {

            ctxCorazon.beginPath();

            ctxCorazon.moveTo(
                x,
                y
            );

            ctxCorazon.lineTo(

                cx +
                estrella.x *
                perspectiva *
                .82,

                cy +
                estrella.y *
                perspectiva *
                .82
            );

            ctxCorazon.strokeStyle =
                `rgba(
                    255,
                    20,
                    60,
                    ${brillo * .22}
                )`;

            ctxCorazon.lineWidth =
                Math.min(
                    2,
                    tamaño * .35
                );

            ctxCorazon.stroke();
        }


        /*
           ESTRELLA
        */

        dibujarEstrellaRoja(
            x,
            y,
            Math.max(
                .45,
                tamaño
            ),
            brillo
        );
    }


    requestAnimationFrame(
        animarCorazon
    );
}

animarCorazon();


/* =========================================
   BOTÓN HELLO KITTY
========================================= */

const botonEntrar =
    document.getElementById("entrar");


if (botonEntrar) {

    botonEntrar.addEventListener(
        "click",
        function () {

            if (viajando) {
                return;
            }

            viajando = true;


            /*
               ACELERAR VIAJE
            */

            let aceleracion = 0;

            const acelerar =
                setInterval(
                    function () {

                        aceleracion += .8;

                        velocidadExtra =
                            aceleracion;

                        if (
                            aceleracion >= 20
                        ) {

                            clearInterval(
                                acelerar
                            );
                        }

                    },
                    40
                );


            /*
               LLEGAR A LA GALAXIA
            */

            setTimeout(
                function () {

                    if (segundaEscena) {

                        segundaEscena.classList.add(
                            "activa"
                        );
                    }

                },
                1100
            );


            /*
               DETENER VIAJE
            */

            setTimeout(
                function () {

                    velocidadExtra = 0;

                },
                2500
            );

        }
    );
}


/* =========================================
   CORAZÓN CONTINUAR
========================================= */

const botonContinuar =
    document.getElementById(
        "continuar"
    );

const explosion =
    document.getElementById(
        "explosion"
    );

const canvasParticulas =
    document.getElementById(
        "particulas"
    );


if (
    canvasParticulas &&
    botonContinuar
) {

    const ctxParticulas =
        canvasParticulas.getContext(
            "2d"
        );

    let particulas = [];


    function ajustarParticulas() {

        canvasParticulas.width =
            window.innerWidth;

        canvasParticulas.height =
            window.innerHeight;
    }

    ajustarParticulas();

    window.addEventListener(
        "resize",
        ajustarParticulas
    );


    /* =====================================
       EXPLOSIÓN
    ===================================== */

    function crearExplosion() {

        particulas = [];

        const centroX =
            window.innerWidth / 2;

        const centroY =
            window.innerHeight / 2;


        for (
            let i = 0;
            i < 220;
            i++
        ) {

            const angulo =
                Math.random() *
                Math.PI * 2;

            const velocidad =
                Math.random() *
                9 + 2;


            particulas.push({

                x: centroX,

                y: centroY,

                vx:
                    Math.cos(angulo) *
                    velocidad,

                vy:
                    Math.sin(angulo) *
                    velocidad,

                tamaño:
                    Math.random() *
                    3 + 1,

                vida: 1

            });
        }
    }


    /* =====================================
       ANIMAR EXPLOSIÓN
    ===================================== */

    function animarParticulas() {

        ctxParticulas.clearRect(
            0,
            0,
            canvasParticulas.width,
            canvasParticulas.height
        );


        for (const p of particulas) {

            p.x += p.vx;

            p.y += p.vy;

            p.vx *= .98;

            p.vy *= .98;

            p.vida -= .015;


            if (p.vida <= 0) {
                continue;
            }


            ctxParticulas.beginPath();

            ctxParticulas.arc(
                p.x,
                p.y,
                p.tamaño,
                0,
                Math.PI * 2
            );

            ctxParticulas.fillStyle =
                `rgba(
                    255,
                    50,
                    100,
                    ${p.vida}
                )`;

            ctxParticulas.shadowBlur =
                12;

            ctxParticulas.shadowColor =
                "#ff174f";

            ctxParticulas.fill();
        }


        requestAnimationFrame(
            animarParticulas
        );
    }

    animarParticulas();


    /* =====================================
       TOCAR CORAZÓN
    ===================================== */

    botonContinuar.addEventListener(
        "click",
        function () {

            botonContinuar.disabled =
                true;


            crearExplosion();


            if (explosion) {

                explosion.classList.add(
                    "explotar"
                );
            }


            const mensajeLlegada =
                document.querySelector(
                    ".mensaje-llegada"
                );


            if (mensajeLlegada) {

                mensajeLlegada.style.opacity =
                    "0";

                mensajeLlegada.style.transform =
                    "scale(.7)";
            }


            setTimeout(
                function () {

                    alert(
                        "❤️ Nuestro universo continúa..."
                    );

                },
                1200
            );
        }
    );
}