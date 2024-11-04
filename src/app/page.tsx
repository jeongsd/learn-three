import Link from "next/link";

export default function Home() {
  return (
    <div className="body">
      <ul>
        <li>
          <Link href="/lessons/first-threejs-project">
            03. lessons/first-threejs-project
          </Link>
        </li>
        <li>
          <Link href="/lessons/transform-objects">04. transform-objects</Link>
        </li>
        <li>
          <Link href="/lessons/animation">05. Animation</Link>
        </li>
        <li>
          <Link href="/lessons/camera">06. Camera</Link>
        </li>
        <li>
          <Link href="/lessons/fullscreen-and-resizing">
            07. Fullscreen and resizing
          </Link>
        </li>
        <li>
          <Link href="/lessons/vector">08. vector</Link>
        </li>
        <li>
          <Link href="/lessons/geometry">09. geometry</Link>
        </li>
        <li>
          <Link href="/lessons/debug-ui">debug-ui</Link>
        </li>
        <li>
          <Link href="/lessons/textures">10. textures</Link>
        </li>
        <li>
          <Link href="/lessons/material">11. material</Link>
        </li>
        <li>
          <Link href="/lessons/3d-text">12. 3d-text</Link>
        </li>
        <li>
          <Link href="/lessons/light">13. light</Link>
        </li>
        <li>
          <Link href="/lessons/shadow">14. shadow</Link>
        </li>
        <li>
          <Link href="/lessons/haunted-house">haunted-house</Link>
        </li>
      </ul>
    </div>
  );
}
