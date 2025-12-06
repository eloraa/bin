# bin

A tiny, sensible pastebin with SSH key-based authentication.

A secure code sharing application that allows authenticated users to create, edit, and share code snippets with syntax highlighting. Built with Next.js.

## Features

- **SSH Key Authentication** - Passwordless authentication using SSH key pairs
- **Private Bins** - Create private code snippets visible only when authenticated
- **Syntax Highlighting** - Support for 15+ programming languages
- **Secure by Design** - AES-256-GCM encryption with JWT tokens and private key re-verification
- **Keyboard Shortcuts** - Quick save with Ctrl/Cmd+S

## Technology Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Authentication**: SSH keys (sshpk) + JWT (jose) + AES-256-GCM encryption
- **Syntax Highlighting**: highlight.js
- **Icons**: lucide-react
- **Font**: Fira Code

## Prerequisites

- Node.js 20+
- pnpm (package manager)
- Neon PostgreSQL database account
- OpenSSL (for key generation)

## Installation & Setup

### Clone and Install

```bash
git clone https://github.com/eloraa/bin
cd bin
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=<your-neon-postgresql-connection-string>
JWT_SECRET=<generate-with-command-below>
ENCRYPTION_KEY=<generate-with-command-below>
```

Generate the required keys:

```bash
# Generate JWT_SECRET (base64, 32+ characters)
openssl rand -base64 32

# Generate ENCRYPTION_KEY (64 hex characters = 32 bytes)
openssl rand -hex 32
```

**Important**:

- `JWT_SECRET` must be base64 format (output from `openssl rand -base64 32`)
- `ENCRYPTION_KEY` must be exactly 64 hexadecimal characters (output from `openssl rand -hex 32`)

### SSH Key Setup

Generate a server SSH key pair for authentication:

```bash
mkdir -p keys
ssh-keygen -t ed25519 -f keys/id_ed25519 -C "bin-server"
# Enter a secure passphrase when prompted
```

**Important**: Keep the passphrase secure. It's required for the authentication system to function.

### Database Setup

Push the database schema to your Neon PostgreSQL database:

```bash
pnpm drizzle-kit push
```

### Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Usage

### Authentication

The application uses a unique SSH key-based authentication system:

1. Navigate to `/secure-login`
2. Paste your SSH public key (typically from `~/.ssh/id_ed25519.pub`)
3. Enter your SSH key passphrase
4. The system validates your key against the server's private key
5. On success, an encrypted session token is created (valid for 7 days)

### Creating Bins

1. Navigate to `/new` (requires authentication)
2. Paste your code
3. Select the programming language (or use Auto Detect)
4. Check "Private" if you want to require authentication for viewing
5. Click "Create Bin" or press Ctrl/Cmd + S

### Viewing Bins

Accessible at `/bin/{id}` or `/{id}` without authentication

## Architecture & Security

### Authentication Flow

The application implements a sophisticated multi-layer authentication system:

1. **Login Phase**:

   - User provides SSH public key and passphrase
   - Server reads its encrypted private key from the filesystem
   - Server decrypts the private key using the provided passphrase
   - Server derives the public key from the decrypted private key
   - Server compares the derived public key fingerprint with the provided public key fingerprint
   - If fingerprints match, authentication succeeds

2. **Token Creation**:

   - User's passphrase is encrypted using AES-256-GCM with a separate encryption key
   - Encrypted passphrase, along with IV and authentication tag, is stored in a JWT payload
   - Public key fingerprint is also stored in the JWT
   - JWT is signed using HS256 algorithm with JWT_SECRET
   - Signed JWT is stored in an HTTP-only, secure, SameSite=lax cookie

3. **Request Validation** (on every authenticated request):
   - JWT is extracted from the cookie
   - JWT signature is verified using JWT_SECRET (integrity check)
   - Encrypted passphrase is extracted and decrypted using ENCRYPTION_KEY
   - Server attempts to decrypt its private key using the decrypted passphrase
   - Server derives the public key from the private key
   - Server compares the derived fingerprint with the fingerprint stored in JWT
   - If all checks pass, the request is authenticated

### Security Features

**Defense in Depth**: The system uses two separate encryption keys:

- `JWT_SECRET` - For JWT signature (protects integrity, prevents tampering)
- `ENCRYPTION_KEY` - For AES-256-GCM passphrase encryption (protects confidentiality)

**Confidentiality**: The passphrase is encrypted with AES-256-GCM before being stored in the JWT. Even if an attacker intercepts the JWT, they cannot read the passphrase without the encryption key.

**Integrity**: The JWT is signed with HS256. Any modification to the JWT payload invalidates the signature, and the token is rejected.

**Real-time Validation**: On every request, the system re-verifies that the passphrase can still decrypt the server's private key.

- If the server's private key changes, all sessions are immediately invalidated
- If the server's private key passphrase changes, all sessions are invalidated
- No database lookups required (stateless authentication)
  |

## Troubleshooting

### "Invalid key length" Error

This error occurs when `ENCRYPTION_KEY` is not the correct length.

**Solution**:

- Ensure `ENCRYPTION_KEY` is exactly 64 hexadecimal characters
- Generate with: `openssl rand -hex 32`
- Verify the value is a hexadecimal string (characters 0-9, a-f only)

### Authentication Fails

If authentication consistently fails:

- Verify the public key you're providing matches the server's private key
- Check that the passphrase is correct for the server's private key
- Ensure `JWT_SECRET` is properly set in the environment
- Verify the server's private key file exists at `keys/id_ed25519`
