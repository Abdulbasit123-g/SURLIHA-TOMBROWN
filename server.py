import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class CustomHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable caching header for local development speed
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

def run(port=8000):
    server_address = ('', port)
    # ThreadingHTTPServer processes requests in separate threads, preventing browser blocking delays
    httpd = ThreadingHTTPServer(server_address, CustomHandler)
    print(f"Starting multithreaded development server on port {port}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run(port)
