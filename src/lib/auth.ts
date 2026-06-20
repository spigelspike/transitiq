export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
};

export type TokenPayload = {
  userId: string;
  email: string;
  exp: number;
};

const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: "user_001",
    email: "demo@transitiq.io",
    password: "Demo@1234",
    name: "Alex Morgan",
    role: "Admin",
    avatar: "AM",
  },
];

export function createToken(userId: string, email: string): string {
  const payload: TokenPayload = {
    userId,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  return btoa(JSON.stringify(payload));
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload: TokenPayload = JSON.parse(atob(token));
    if (payload.exp > Date.now()) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

export function signIn(
  email: string,
  password: string
): { token: string; user: AuthUser } | null {
  const found = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (!found) return null;

  const token = createToken(found.id, found.email);
  const { password: _, ...user } = found;
  return { token, user };
}

export function signUp(
  email: string,
  password: string,
  name: string
): { token: string; user: AuthUser } | null {
  const exists = MOCK_USERS.find((u) => u.email === email);
  if (exists) return null;

  const newUser = {
    id: `user_${String(MOCK_USERS.length + 1).padStart(3, "0")}`,
    email,
    password,
    name,
    role: "User",
    avatar: name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
  };

  MOCK_USERS.push(newUser);

  const token = createToken(newUser.id, newUser.email);
  const { password: _, ...user } = newUser;
  return { token, user };
}

export function getUserById(id: string): AuthUser | null {
  const found = MOCK_USERS.find((u) => u.id === id);
  if (!found) return null;
  const { password: _, ...user } = found;
  return user;
}
