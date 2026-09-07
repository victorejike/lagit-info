import http.server
import socketserver
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            print(f"LegitInfo Prototype serving at http://localhost:{port}")
            print("Press Ctrl+C to stop.")
            httpd.serve_forever()
    except OSError as e:
        if port == 3000:
            print(f"Port 3000 in use, trying 3001...")
            with socketserver.TCPServer(("", 3001), Handler) as httpd:
                print(f"LegitInfo Prototype serving at http://localhost:3001")
                httpd.serve_forever()
        else:
            raise e
