import Link from "next/link";

export default function Home() {
  return (
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
    </ul>
  );
}
