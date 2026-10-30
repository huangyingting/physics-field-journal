export function projectile(speed, angle, time, gravity = 9.8) {
  const radians = angle * Math.PI / 180;
  return { x: speed * Math.cos(radians) * time, y: speed * Math.sin(radians) * time - 0.5 * gravity * time * time };
}

export function flightTime(speed, angle, gravity = 9.8) {
  return 2 * speed * Math.sin(angle * Math.PI / 180) / gravity;
}
