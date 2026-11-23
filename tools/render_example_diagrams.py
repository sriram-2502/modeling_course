from contextlib import contextmanager
from math import cos, pi, sin
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Arc, Circle, FancyArrowPatch, Rectangle


OUT = Path(__file__).resolve().parents[1] / "site/assets/images/examples"
INK = "#291c36"
PURPLE = "#5c3184"
GREEN = "#176454"
ORANGE = "#963f08"
GRAY = "#71687a"
TINT = "#f5eff9"
WATER = "#b9dcf4"
plt.rcParams.update({"font.family": "DejaVu Sans", "mathtext.fontset": "dejavusans", "svg.hashsalt": "me3050"})


@contextmanager
def plate(name, height=4.0, horizontal=(0, 10)):
    width = horizontal[1] - horizontal[0]
    fig, ax = plt.subplots(figsize=(.72 * width, .72 * height))
    fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
    ax.set(xlim=horizontal, ylim=(0, height), aspect="equal")
    ax.axis("off")
    yield ax
    fig.savefig(OUT / f"{name}.svg", metadata={"Date": None})
    plt.close(fig)


def wire(ax, *points, color=INK, width=1.7, style="-"):
    x, y = zip(*points)
    ax.plot(x, y, color=color, lw=width, linestyle=style, solid_capstyle="round")


def label(ax, x, y, text, color=INK, size=13, align="center"):
    ax.text(x, y, text, color=color, ha=align, va="center", fontsize=size)


def arrow(ax, start, end, text="", at=None, color=ORANGE, curve=0, size=13):
    ax.add_patch(FancyArrowPatch(start, end, arrowstyle="-|>", mutation_scale=14,
                                 color=color, lw=1.65, shrinkA=0, shrinkB=0,
                                 connectionstyle=f"arc3,rad={curve}"))
    if at:
        label(ax, *at, text, color, size)


def dot(ax, x, y, color=INK):
    ax.add_patch(Circle((x, y), .06, color=color, zorder=4))


def box(ax, x, y, w, h, text, color=PURPLE, fill=TINT):
    ax.add_patch(Rectangle((x - w / 2, y - h / 2), w, h, fc=fill, ec=color, lw=1.7))
    label(ax, x, y, text, color)


def resistor(ax, x1, x2, y, text, color=PURPLE):
    x = [x1] + [x1 + (x2 - x1) * i / 10 for i in range(1, 10)] + [x2]
    z = [0, 0, .16, -.16, .16, -.16, .16, -.16, .16, 0, 0]
    wire(ax, *zip(x, [y + dy for dy in z]), color=color)
    label(ax, (x1 + x2) / 2, y + .48, text, color)


def coil(ax, x1, x2, y, text):
    step = (x2 - x1) / 4
    for index in range(4):
        points = [(x1 + step * (index + .5 - .5 * cos(pi * i / 20)),
                   y + .23 * sin(pi * i / 20)) for i in range(21)]
        wire(ax, *points, color=GREEN)
    label(ax, (x1 + x2) / 2, y + .55, text, GREEN)


def capacitor(ax, x, low, high, text, output=None):
    y = (high + low) / 2
    wire(ax, (x, high), (x, y + .11))
    wire(ax, (x, y - .11), (x, low))
    for dy in (-.11, .11):
        wire(ax, (x - .35, y + dy), (x + .35, y + dy), color=PURPLE)
    label(ax, x - .69, y, text, PURPLE)
    if output:
        label(ax, x + .55, y + .44, "+")
        label(ax, x + .55, y - .44, "−")
        label(ax, x + 1.11, y, output)


def source(ax, x, low, high, text):
    y = (high + low) / 2
    wire(ax, (x, high), (x, y + .38))
    wire(ax, (x, y - .38), (x, low))
    ax.add_patch(Circle((x, y), .38, fill=False, ec=INK, lw=1.6))
    label(ax, x, y + .15, "+", size=11)
    label(ax, x, y - .15, "−", size=11)
    label(ax, x - .87, y, text)


def circuits():
    for kind in ("rc", "rl", "rlc", "rc-ladder"):
        with plate(kind) as ax:
            low, high = .55, 2.62
            source(ax, 1.75, low, high, "$u(t)$")
            wire(ax, (1.75, high), (2.9, high))
            resistor(ax, 2.9, 4.42, high, "$R_1$" if kind == "rc-ladder" else "$R$")
            arrow(ax, (1.94, 3.28), (2.73, 3.28), "$i(t)$", (2.33, 3.65), GREEN)
            wire(ax, (4.42, high), (4.95, high))
            if kind == "rl":
                coil(ax, 4.95, 7.08, high, "$L$")
                wire(ax, (7.08, high), (7.9, high), (7.9, low), (1.75, low))
                continue
            if kind == "rlc":
                coil(ax, 4.95, 7.08, high, "$L$")
                wire(ax, (7.08, high), (7.9, high))
            elif kind == "rc-ladder":
                capacitor(ax, 4.95, low, high, "$C_1$")
                label(ax, 4.95, 3.11, "$v_1$")
                wire(ax, (4.95, high), (5.53, high))
                resistor(ax, 5.53, 7.2, high, "$R_2$")
                wire(ax, (7.2, high), (7.9, high))
                dot(ax, 4.95, low)
                dot(ax, 4.95, high)
            else:
                wire(ax, (4.95, high), (7.9, high))
            capacitor(ax, 7.9, low, high, "$C_2$" if kind == "rc-ladder" else "$C$",
                      "$v_2$" if kind == "rc-ladder" else "$v_C$")
            wire(ax, (1.75, low), (7.9, low))
            if kind == "rc-ladder":
                wire(ax, (1.75, low), (1.75, .35))
                for elevation, half_width in [(.35, .21), (.26, .14), (.17, .07)]:
                    wire(ax, (1.75 - half_width, elevation), (1.75 + half_width, elevation))


def torque_diagram(name, opposing_label):
    with plate(name) as ax:
        center_x, center_y = 5, 1.69
        ax.add_patch(Circle((center_x, center_y), .66, fc=TINT, ec=PURPLE, lw=1.7))
        dot(ax, center_x, center_y, PURPLE)
        label(ax, center_x, 1.40, "Rotor $J$", PURPLE, 16)

        def torque_arc(start, stop, color):
            radius = 1.11
            angles = [(start + (stop - start) * index / 32) * pi / 180 for index in range(33)]
            points = [(center_x + radius * cos(a), center_y + radius * sin(a)) for a in angles]
            wire(ax, *points[:-2], color=color, width=2)
            arrow(ax, points[-3], points[-1], color=color)

        torque_arc(12, 151, ORANGE)
        torque_arc(248, 177, GREEN)
        torque_arc(361, 296, PURPLE)
        label(ax, 5, 3.31, r"Drive torque $K_t i$", ORANGE, 17)
        label(ax, 2.26, .81, r"Damping $b\omega$", GREEN, 16)
        label(ax, 7.84, .81, opposing_label, PURPLE, 16)
        label(ax, 5, .22, "Positive rotation is counterclockwise.", INK, 13)


def motor():
    with plate("dc-motor") as ax:
        low, high = .65, 2.64
        source(ax, 1.55, low, high, "$v(t)$")
        wire(ax, (1.55, high), (2.4, high))
        resistor(ax, 2.4, 4.0, high, "$R$")
        wire(ax, (4.0, high), (4.25, high))
        coil(ax, 4.25, 5.85, high, "$L$")
        wire(ax, (5.85, high), (6.36, high), (6.36, 2.22))
        wire(ax, (1.55, low), (6.36, low), (6.36, 1.07))
        ax.add_patch(Circle((6.36, 1.65), .57, fill=True, fc=TINT, ec=PURPLE, lw=1.7))
        label(ax, 6.36, 1.65, "M", PURPLE)
        label(ax, 5.0, 1.6, "$K_e\\omega$", GREEN)
        label(ax, 5.6, 2.08, "+", GREEN)
        label(ax, 5.6, 1.15, "−", GREEN)
        arrow(ax, (1.65, 3.36), (2.44, 3.36), "$i$", (2.02, 3.66), GREEN)
        wire(ax, (6.93, 1.65), (7.85, 1.65))
        box(ax, 8.48, 1.65, 1.27, .83, "$J, b$")
        arrow(ax, (7.15, 2.32), (8.72, 2.32), r"$K_t i,\ \omega$", (7.94, 2.76))
        arrow(ax, (9.25, 1.0), (8.07, 1.0), "$T_{\\rm load}$", (8.68, .58), GREEN)
    with plate("galvanometer") as ax:
        box(ax, 1.15, 1.83, .70, 1.02, "N")
        box(ax, 5.70, 1.83, .70, 1.02, "S")
        for y in (1.25, 2.5):
            arrow(ax, (1.57, y), (5.26, y), color=GREEN)
        label(ax, 3.43, 3.16, r"Magnetic field $\mathbf{B}$", GREEN, 16)
        ax.add_patch(Circle((3.42, 1.83), .63, fc=TINT, ec=PURPLE, lw=1.7, zorder=2))
        label(ax, 3.42, 1.83, "Coil", PURPLE, 16)
        label(ax, 2.43, 1.83, "×", ORANGE, 16)
        dot(ax, 4.42, 1.83, ORANGE)
        arrow(ax, (2.43, 1.64), (2.43, .77), "$F$", (1.99, .82))
        arrow(ax, (4.42, 2.01), (4.42, 2.88), "$F$", (4.84, 2.81))
        ax.add_patch(Arc((7.84, 1.42), 2.64, 2.64, theta1=27, theta2=153, color=PURPLE, lw=2))
        dot(ax, 7.84, 1.42)
        arrow(ax, (7.84, 1.42), (8.42, 2.45), r"$\theta$", (8.55, 1.77))
        label(ax, 7.84, .87, "Pointer", PURPLE, 16)
    torque_diagram("galvanometer-fbd", r"Spring $k\theta$")
    torque_diagram("dc-motor-fbd", r"Load $T_{\rm load}$")


def tank(ax, x, y, width, height, level):
    ax.add_patch(Rectangle((x, y), width, level, fc=WATER, ec="none"))
    wire(ax, (x, y + height), (x, y), (x + width, y), (x + width, y + height))
    wire(ax, (x, y + level), (x + width, y + level), color="#437597")


def fluid():
    with plate("tank", horizontal=(1.65, 9.35)) as ax:
        tank(ax, 3.05, .65, 3, 2.5, 1.65)
        arrow(ax, (4.1, 3.69), (4.1, 2.66), "$q_{\\rm in}$", (3.55, 3.6), GREEN, size=16)
        wire(ax, (6.05, .65), (7.0, .65))
        arrow(ax, (7.0, .65), (8.84, .65), "$q_{\\rm out}$", (7.97, .98), GREEN, size=16)
        for elevation in (.65, 2.30):
            wire(ax, (2.5, elevation), (2.78, elevation), color=GRAY)
        wire(ax, (2.64, .65), (2.64, 2.30), color=GRAY)
        label(ax, 2.29, 1.48, "$h$", size=16)
        label(ax, 4.55, 1.43, "Tank area $A$", size=16)
        label(ax, 6.62, .28, "Outlet area $A_o$", size=16)
    with plate("mixing-tanks") as ax:
        tank(ax, 1.26, 1.71, 2.38, 1.5, .87)
        tank(ax, 5.97, .42, 2.38, 1.5, .87)
        label(ax, 2.70, 3.47, "Tank 1", size=16)
        label(ax, 7.39, 2.18, "Tank 2", size=16)
        arrow(ax, (1.57, 3.7), (1.57, 2.87), "$q_{\\rm in}, c_{\\rm in}$", (.83, 3.50), GREEN, size=16)
        wire(ax, (3.64, 1.71), (6.34, 1.71))
        arrow(ax, (6.34, 1.71), (6.34, 1.39), "$q_{12}, c_1$", (4.93, 2.03), GREEN, size=16)
        wire(ax, (8.35, .42), (8.66, .42))
        arrow(ax, (8.66, .42), (9.65, .42), "$q_{\\rm out}, c_2$", (9.10, .78), GREEN, size=16)
        label(ax, 2.45, 2.17, "$V_1, c_1$", size=16)
        label(ax, 7.16, .88, "$V_2, c_2$", size=16)
    with plate("hydraulic-actuator") as ax:
        box(ax, 4.82, 1.89, 5.22, 1.5, "", PURPLE, WATER)
        box(ax, 4.95, 1.89, .33, 1.5, "", INK, TINT)
        box(ax, 6.20, 1.89, 2.19, .32, "", INK, TINT)
        arrow(ax, (3.12, 3.38), (3.12, 2.65), "$q_1$", (2.75, 3.45), GREEN)
        arrow(ax, (6.52, 2.65), (6.52, 3.38), "$q_2$", (6.9, 3.45), GREEN)
        label(ax, 3.41, 2.32, "$p_1$")
        label(ax, 6.13, 2.32, "$p_2$")
        arrow(ax, (7.75, 1.89), (9, 1.89), "$+x$", (8.39, 2.23))
        label(ax, 4.95, .77, "Piston and rod")


def thermal():
    with plate("thermal") as ax:
        box(ax, 4.03, 1.8, 2.8, 1.5, r"$T,\ C_{\rm th}$")
        arrow(ax, (.52, 1.8), (2.6, 1.8), "$P$", (1.59, 2.22), ORANGE)
        wire(ax, (5.43, 1.8), (5.72, 1.8))
        resistor(ax, 5.72, 7.42, 1.8, "$R_{\\rm th}$")
        arrow(ax, (7.42, 1.8), (8.48, 1.8))
        label(ax, 8.97, 1.8, "$T_a$")
        label(ax, 4.03, 3.12, "Lumped body")
        label(ax, 7.13, .99, "$q=(T-T_a)/R_{\\rm th}$", GREEN)
    with plate("thermal-pair") as ax:
        box(ax, 2.49, 1.87, 2.25, 1.31, r"$T_1,\ C_1$")
        box(ax, 7.51, 1.87, 2.25, 1.31, r"$T_2,\ C_2$")
        wire(ax, (3.62, 1.87), (4.22, 1.87))
        resistor(ax, 4.22, 5.77, 1.87, "$R_{12}$")
        wire(ax, (5.77, 1.87), (6.38, 1.87))
        arrow(ax, (4.17, 1.07), (5.82, 1.07), "$q_{12}$", (5, .68), GREEN)
        arrow(ax, (2.49, 3.45), (2.49, 2.53), "$P_1$", (1.99, 3.21))
        arrow(ax, (7.51, 3.45), (7.51, 2.53), "$P_2$", (7.01, 3.21))


def mechanics():
    with plate("pendulum") as ax:
        pivot, bob = (3.1, 3.13), (4.57, 1.05)
        wire(ax, (2.67, 3.13), (3.53, 3.13), color=GRAY)
        wire(ax, pivot, (3.1, .45), color=GRAY, style="--")
        wire(ax, pivot, bob, color=PURPLE, width=2.4)
        dot(ax, *pivot)
        ax.add_patch(Circle(bob, .20, fc=TINT, ec=PURPLE, lw=1.9, zorder=3))
        ax.add_patch(Arc(pivot, 1.53, 1.53, theta1=-90, theta2=-55, color=GREEN, lw=1.6))
        label(ax, 3.39, 2.04, r"$\theta$", GREEN)
        label(ax, 4.17, 2.28, r"$\ell$")
        label(ax, 4.9, 1.30, "$m$")
        arrow(ax, bob, (4.57, .36), "$mg$", (5.06, .48))
        arrow(ax, (4.51, 1.13), (4.03, 1.81), "Link force", (5.23, 1.96), GREEN)
        label(ax, 6.92, 2.54, "Moments about the pivot", align="left", size=11)
        label(ax, 6.92, 2.00, r"$-mg\ell\sin\theta$", align="left")
    with plate("mass-spring-damper") as ax:
        wire(ax, (.81, 1.2), (.81, 3.18), color=GRAY, width=2)
        wire(ax, (.81, 1.2), (9.18, 1.2), color=GRAY)
        box(ax, 6.19, 1.94, 2.31, 1.48, "$m$")
        resistor(ax, 1.83, 4.35, 2.27, "$k$")
        wire(ax, (.81, 2.27), (1.83, 2.27))
        wire(ax, (4.35, 2.27), (5.03, 2.27))
        wire(ax, (.81, 1.64), (2.40, 1.64), color=GREEN)
        wire(ax, (3.75, 1.45), (2.40, 1.45), (2.40, 1.83), (3.75, 1.83), color=GREEN)
        wire(ax, (3.36, 1.51), (3.36, 1.77), color=GREEN)
        wire(ax, (3.36, 1.64), (5.03, 1.64), color=GREEN)
        label(ax, 3.07, .88, "$c$", GREEN)
        arrow(ax, (7.35, 2.1), (9.21, 2.1), "$f(t)$", (8.38, 2.47))
        arrow(ax, (5.56, .72), (6.94, .72), "$+x$", (6.24, .37), PURPLE)
    with plate("spring-connections") as ax:
        for x, name in [(1.0, "Parallel"), (5.68, "Series")]:
            wire(ax, (x, .81), (x, 3.38), color=GRAY, width=2.4)
            label(ax, x + 1.42, .44, name)
        for y, spring in [(2.54, "$k_1$"), (1.5, "$k_2$")]:
            wire(ax, (1, y), (1.50, y))
            resistor(ax, 1.50, 3.16, y, spring)
            wire(ax, (3.16, y), (3.60, y))
        wire(ax, (3.6, 1.35), (3.6, 2.77), color=GRAY, width=2)
        wire(ax, (5.68, 2), (5.93, 2))
        resistor(ax, 5.93, 7.33, 2, "$k_1$")
        resistor(ax, 7.33, 8.73, 2, "$k_2$")
        arrow(ax, (8.73, 2), (9.49, 2), "$x$", (9.51, 2.42))
        arrow(ax, (3.6, 2), (4.53, 2), "$x$", (4.51, 2.42))
    with plate("drive-train") as ax:
        for x, radius, name in [(3.5, 1.05, "$N_1$"), (5.37, .82, "$N_2$")]:
            ax.add_patch(Circle((x, 1.86), radius, fc=TINT, ec=PURPLE, lw=1.8))
            dot(ax, x, 1.86)
            label(ax, x, 1.86 + .39, name, PURPLE)
        dot(ax, 4.55, 1.86, ORANGE)
        arrow(ax, (2.43, 2.96), (2.09, 1.3), r"$\omega_1$", (1.53, 2.11), curve=.42)
        arrow(ax, (6.28, 2.79), (6.53, 1.37), r"$\omega_2$", (7.01, 2.11), curve=-.39)
        label(ax, 4.58, .34, "Pitch circles touch at the point of equal rim speed.", size=11)
    with plate("feedback") as ax:
        arrow(ax, (.40, 2.44), (2.04, 2.44), "$r$", (1.11, 2.81), GREEN)
        ax.add_patch(Circle((2.24, 2.44), .20, fc="white", ec=INK, lw=1.5))
        label(ax, 1.93, 2.7, "+", size=11)
        label(ax, 2.50, 2.09, "−", size=11)
        arrow(ax, (2.44, 2.44), (3.47, 2.44), "$e$", (2.98, 2.81))
        box(ax, 4.17, 2.44, 1.4, .72, "$K_p$")
        arrow(ax, (4.87, 2.44), (5.77, 2.44), "$F$", (5.33, 2.81))
        box(ax, 7.02, 2.44, 2.5, .72, "$1/(ms^2+cs+k)$")
        arrow(ax, (8.27, 2.44), (9.65, 2.44), "$x$", (9.44, 2.81))
        wire(ax, (8.88, 2.44), (8.88, 1.01), (2.24, 1.01))
        arrow(ax, (2.24, 1.01), (2.24, 2.22), color=INK)
        dot(ax, 8.88, 2.44)
        label(ax, 5.46, .60, "Unity position feedback", GREEN, 11)


def transfer_blocks():
    def junction(ax, x, y):
        ax.add_patch(Circle((x, y), .26, fc="white", ec=INK, lw=1.7))
        label(ax, x, y, r"$\Sigma$", size=15)

    def transfer_block(ax, x, y, width, math):
        box(ax, x, y, width, .72, "")
        label(ax, x, y, math, PURPLE, 20)

    with plate("transfer-outputs", height=2.55) as ax:
        y = 1.53
        arrow(ax, (.43, y), (1.98, y), color=INK)
        label(ax, 1.13, 1.96, "$F(s)$", size=19)
        transfer_block(ax, 3.74, y, 3.45, r"$\frac{1}{ms^2+cs+k}$")
        arrow(ax, (5.47, y), (7.03, y), color=INK)
        dot(ax, 6.10, y, PURPLE)
        arrow(ax, (6.10, y), (6.10, .35), color=PURPLE)
        label(ax, 6.74, .52, "$X(s)$", PURPLE, 19)
        transfer_block(ax, 7.59, y, 1.12, "$s$")
        arrow(ax, (8.15, y), (9.63, y), color=INK)
        label(ax, 9.03, 1.95, "$V(s)$", size=19)

    with plate("transfer-integrators", height=3.7) as ax:
        y = 2.67
        junction(ax, 1.65, y)
        arrow(ax, (.34, y), (1.39, y), color=INK)
        label(ax, .66, 3.12, "$F(s)$", size=17)
        label(ax, 1.15, 2.90, "+", size=14)
        label(ax, 1.42, 2.22, "−", GREEN, 15)
        arrow(ax, (1.91, y), (2.79, y), color=INK)
        transfer_block(ax, 3.37, y, 1.16, "$1/m$")
        arrow(ax, (3.95, y), (5.04, y), color=INK)
        label(ax, 4.47, 3.12, "$A(s)$", size=17)
        transfer_block(ax, 5.62, y, 1.16, "$1/s$")
        arrow(ax, (6.2, y), (7.44, y), color=INK)
        label(ax, 6.81, 3.12, "$V(s)$", size=17)
        transfer_block(ax, 8.02, y, 1.16, "$1/s$")
        arrow(ax, (8.60, y), (9.65, y), color=INK)
        label(ax, 9.21, 3.12, "$X(s)$", size=17)
        for x, height, math in [(6.81, 1.36, "$c$"), (9.16, .46, "$k$")]:
            dot(ax, x, y, GREEN)
            wire(ax, (x, y), (x, height), color=GREEN)
            arrow(ax, (x, height), (5.12, height), color=GREEN)
            transfer_block(ax, 4.59, height, 1.06, math)
        junction(ax, 2.88, 1.36)
        arrow(ax, (4.06, 1.36), (3.14, 1.36), color=GREEN)
        label(ax, 3.35, 1.63, "+", GREEN, 13)
        wire(ax, (4.06, .46), (2.88, .46), color=GREEN)
        arrow(ax, (2.88, .46), (2.88, 1.10), color=GREEN)
        label(ax, 2.62, .89, "+", GREEN, 13)
        wire(ax, (2.62, 1.36), (1.65, 1.36), color=GREEN)
        arrow(ax, (1.65, 1.36), (1.65, 2.41), color=GREEN)
        label(ax, 2.53, 1.94, "$cV+kX$", GREEN, 15)

    with plate("transfer-loop", height=3.4) as ax:
        y = 2.43
        junction(ax, 2.04, y)
        arrow(ax, (.55, y), (1.78, y), color=INK)
        label(ax, 1.03, 2.86, "$F(s)$", size=18)
        label(ax, 1.55, 2.64, "+", size=13)
        label(ax, 2.34, 2.10, "−", GREEN, 16)
        arrow(ax, (2.30, y), (3.52, y), color=INK)
        transfer_block(ax, 5.02, y, 3, r"$G(s)=\frac{1}{ms^2}$")
        arrow(ax, (6.52, y), (9.60, y), color=INK)
        label(ax, 9.03, 2.86, "$X(s)$", size=18)
        dot(ax, 8.31, y, GREEN)
        wire(ax, (8.31, y), (8.31, .75), color=GREEN)
        arrow(ax, (8.31, .75), (6.52, .75), color=GREEN)
        transfer_block(ax, 5.02, .75, 3, "$H(s)=cs+k$")
        wire(ax, (3.52, .75), (2.04, .75), color=GREEN)
        arrow(ax, (2.04, .75), (2.04, 2.17), color=GREEN)

    with plate("transfer-reduced", height=2.0) as ax:
        transfer_block(ax, 5, .93, 3.76, r"$\frac{1}{ms^2+cs+k}$")
        arrow(ax, (1.13, .93), (3.12, .93), color=INK)
        label(ax, 2.05, 1.45, "$F(s)$", size=18)
        arrow(ax, (6.88, .93), (8.91, .93), color=INK)
        label(ax, 8.05, 1.45, "$X(s)$", size=18)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    circuits()
    motor()
    fluid()
    thermal()
    mechanics()
    transfer_blocks()
