import http.server
import socketserver
import urllib.parse

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        query = urllib.parse.urlparse(self.path).query
        if query:
            print("ERROR REPORTED:", urllib.parse.unquote(query))
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

with socketserver.TCPServer(("", 8080), MyHandler) as httpd:
    print("serving at port 8080")
    httpd.serve_forever()
