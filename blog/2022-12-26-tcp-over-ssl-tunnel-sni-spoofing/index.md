---
title: SNI Spoofing Analysis
authors: [hirusha]
tags: [python, network, hacking]
---

In today’s internet, SNI (Server Name Indication) plays a critical role in making secure connections. However, the SNI field is sometimes used as a gatekeeper to restrict or manage content access. This blog post will walk through **what SNI spoofing is, why it works**, and demonstrate how to implement a basic SNI spoofing proxy in Python.

<!--truncate-->

## SNI Spoofing: Basics

### What is SNI?

**Server Name Indication (SNI)** is an extension of the TLS (Transport Layer Security) protocol that allows a client to specify the hostname it wants to connect to during the TLS handshake. This is important because many servers host multiple domains on the same IP address, especially in virtual hosting setups. When a client specifies the intended hostname, the server can respond with the correct SSL/TLS certificate. Without SNI, the server wouldn’t know which certificate to provide, and the connection might fail.

#### Example

Imagine a server hosting both `example.com` and `example.net`. When you visit `https://example.com`, your browser sends a request with the hostname `example.com` in the SNI field, allowing the server to select the correct SSL certificate. If the SNI field didn’t specify this hostname, the server might provide the certificate for `example.net`, leading to a certificate mismatch.

Below is the wireshark output of the extension, where the "Server Name" is `clients5.google.com`

```
Extension: server_name (len=24)
Type: server_name (0)
Length: 24
Server Name Indication extension
Server Name list length: 22
Server Name Type: host_name (0)
Server Name length: 19
Server Name: clients5.google.com
```

### What is SNI Spoofing?

SNI spoofing is the process of altering the SNI field in a client’s TLS handshake to make the server believe the client is requesting a different hostname. This is often done to bypass content restrictions or access restricted sections of a server. By changing the SNI field, we can trick the server into thinking we’re accessing a different hostname, which may allow access to certain restricted resources.

### How it Works?

At the core, SNI spoofing involves intercepting a connection and modifying the SNI field before forwarding it to the destination server. The **SNI field is set during the TLS handshake** - the initial part of a secure connection setup. By manipulating the SNI hostname, we essentially alter the target of the request in the server’s eyes.

Here’s how it works in simple terms:
1. **Client connects to a proxy** and sends a request to access a specific website.
2. **Proxy intercepts the request** and reads the target hostname and port.
3. **Proxy establishes a secure connection to the server**, but it injects a different hostname into the SNI field.
4. The server responds based on the spoofed hostname, giving access based on this modified SNI field.

### Implementation

Now, let’s dive into the Python code. Below is a Python script that implements a simple SSL/TLS proxy with SNI spoofing. It listens on a port for incoming client connections, intercepts each request, and injects a custom SNI hostname before forwarding the request to the server.

The code provided below is a full implementation of a basic SNI spoofing proxy.

```python
# -*- coding: utf-8 -*-

import socket
import threading
import select

SNI_HOST = 'www.example.com'  # The hostname to inject in the SNI field
LISTEN_PORT = 8088  # Port on which the proxy listens for client connections

def conecta(c, a):
    print('<#> Cliente {} recebido!'.format(a[-1]))
    request = c.recv(8192)

    host = request.split(':')[0].split()[-1]  # Extract target host from client request
    port = request.split(':')[-1].split()[0]  # Extract target port from client request

    # Establish a connection to the target host and port
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((str(host), int(port)))

    # Wrap the socket with SSL and specify the SNI hostname
    import ssl
    ctx = ssl.SSLContext(ssl.PROTOCOL_SSLv23)
    s = ctx.wrap_socket(s, server_hostname=str(SNI_HOST))

    # Inform the client that the connection has been established
    c.send(b"HTTP/1.1 200 Established\r\n\r\n")

    # Enter a loop to forward data between client and server
    connected = True
    while connected:
        r, w, x = select.select([c, s], [], [c, s], 3)
        if x:
            connected = False
            break
        for i in r:
            try:
                # Receive data
                data = i.recv(8192)
                if not data:
                    connected = False
                    break
                # Forward data to the correct recipient
                if i is s:
                    c.send(data)
                else:
                    s.send(data)
            except:
                connected = False
                break
    c.close()
    s.close()
    print('<#> Cliente {} Desconectado!'.format(a[-1]))

# Setup listening socket for incoming connections
print('Injector SSL com SNI Host em Python\n\
Versao de Teste.\n\
Criado por Marcone.\n')
l = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
l.bind(('', int(LISTEN_PORT)))
l.listen(0)
print('Esperando Cliente no Ip e Porta: 127.0.0.1:{}\n'.format(LISTEN_PORT))
while True:
    c, a = l.accept()
    threading.Thread(target=conecta, args=(c, a)).start()
l.close()
```

### Walkthrough

#### Setup

1. **SNI_HOST and LISTEN_PORT**:
   - `SNI_HOST`: The hostname to inject in the SNI field. This is the host that the target server will see in the SNI field of the TLS handshake.
   - `LISTEN_PORT`: The local port that the proxy server listens on to accept incoming client connections.

#### Connection Handling

The main function, `conecta`, handles each incoming client connection. Here’s how it works:

1. **Intercepting Client Request**: It receives the initial client request and extracts the `host` and `port` to which the client wants to connect.
2. **SSL Wrapping with SNI Injection**:
   - It establishes a secure connection to the specified `host` and `port`.
   - The `ssl.SSLContext` object wraps the socket and sets the SNI field to the specified `SNI_HOST`.
3. **Data Forwarding**: It then continuously forwards data between the client and the target server until one of them disconnects.
4. **Closing Connections**: When either party disconnects or an error occurs, both the client and server sockets are closed.

#### Listener

The last section of the script sets up the main listening socket on the specified `LISTEN_PORT`. For each incoming connection, a new thread is started, running the `conecta` function.

### How?

The script essentially acts as a **man-in-the-middle proxy** that:
- Accepts incoming client connections.
- Modifies the SNI field to a different hostname (`SNI_HOST`) during the TLS handshake.
- Forwards data back and forth, giving the client the impression it is connected directly to the destination server.

The **`server_hostname` parameter** in the `ctx.wrap_socket()` function is the key part of the spoofing process. By specifying a custom hostname, the proxy is able to "spoof" the SNI field and trick the server into responding as if the client was accessing the specified `SNI_HOST`.


## SNI Spoofing: Advanced - with TCP over SSL Tunneling

In addition to using a simple SSL proxy, a more advanced method for SNI spoofing involves setting up a **TCP over SSL tunnel**. This method allows the creation of a secure, low-level connection to manipulate data directly, providing more control over how the connection is handled. With this technique, we can extend the basic SNI spoofing by establishing an SSL tunnel, which makes it appear as if we are accessing an entirely different hostname even over a raw TCP connection.

### What?

TCP over SSL tunneling is a technique where a direct TCP connection is encapsulated within SSL encryption. This allows all TCP data to pass securely through an SSL connection, allowing us to establish a secure tunnel to any server and port while controlling SSL handshakes, including modifying SNI fields. 

The benefit of SSL tunneling with TCP over a raw connection is:
- **Encryption**: It keeps data secure and encrypted during transit.
- **Advanced Manipulation**: It allows for complex alterations of SSL parameters, such as SNI spoofing.
- **Compatibility**: It works well for situations requiring data encapsulation for legacy applications or systems that do not natively support SSL.

### How it Works?

The process of setting up a TCP over SSL tunnel with SNI spoofing involves these steps:
1. **Establish a TCP connection** with the target server.
2. **Wrap the TCP socket with SSL** to create a secure tunnel.
3. **Inject a custom SNI hostname** in the SSL handshake to spoof the intended hostname.
4. **Forward data securely** through the established tunnel, acting as a transparent proxy between the client and the target server.

This setup makes the server think it’s communicating directly with a client requesting the spoofed SNI hostname, while we control the data flow within the tunnel.

### Implementation

The following code sets up a TCP over SSL tunnel in Python with SNI spoofing capabilities, where it can forward data securely between the client and the target server.

```python
import socket
import ssl
import threading
import select

# Configurable SNI host and listening port
SNI_HOST = 'www.example.com'  # Hostname to spoof in the SNI field
LISTEN_PORT = 8088  # Local port to listen on

def handle_client(client_socket, client_address):
    print(f"Connection received from {client_address}")

    # Receive initial client request and parse the target host and port
    client_request = client_socket.recv(8192)
    target_host = client_request.split(b':')[0].split()[-1].decode()
    target_port = int(client_request.split(b':')[-1].split()[0])

    # Establish a TCP connection to the target server
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.connect((target_host, target_port))

    # Wrap the server socket with SSL and inject custom SNI hostname
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    secure_socket = ssl_context.wrap_socket(server_socket, server_hostname=SNI_HOST)

    # Inform the client of the successful connection establishment
    client_socket.send(b"HTTP/1.1 200 Connection Established\r\n\r\n")

    # Begin data forwarding between the client and the target server
    while True:
        sockets_ready, _, _ = select.select([client_socket, secure_socket], [], [])
        for sock in sockets_ready:
            try:
                # Read data from either socket and forward it to the other
                data = sock.recv(8192)
                if not data:
                    return  # Disconnect if no data is received
                if sock is client_socket:
                    secure_socket.send(data)
                else:
                    client_socket.send(data)
            except Exception as e:
                print(f"Error during data forwarding: {e}")
                return

    # Close all connections when finished
    client_socket.close()
    secure_socket.close()
    print(f"Disconnected from {client_address}")

# Setup main listener socket for incoming client connections
def start_server():
    print(f"Starting TCP over SSL Tunnel on port {LISTEN_PORT}")
    listener_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener_socket.bind(('', LISTEN_PORT))
    listener_socket.listen(5)
    print(f"Listening for clients on port {LISTEN_PORT}...")

    # Accept incoming connections and start new threads to handle each one
    while True:
        client_socket, client_address = listener_socket.accept()
        threading.Thread(target=handle_client, args=(client_socket, client_address)).start()

start_server()
```

### Walkthrough

1. **Setting Up the Listener**:
   - The server listens on the specified `LISTEN_PORT`.
   - When a client connection is established, it hands off the socket to a new thread running the `handle_client` function.

2. **Handling the Client Request**:
   - The `handle_client` function receives the client request and parses out the target `host` and `port`.
   - Using the `SNI_HOST`, the script wraps the connection in an SSL tunnel, where it spoofs the SNI field with the hostname `SNI_HOST`.

3. **SSL Wrapping with SNI Spoofing**:
   - The `ssl_context.wrap_socket()` function creates an SSL-encrypted connection with the specified `server_hostname` as the SNI field.
   - This is where the SNI spoofing occurs. By specifying a different hostname in the `server_hostname` parameter, we are telling the server to see the request as originating for `SNI_HOST`.

4. **Data Forwarding**:
   - The script then enters a loop to read data from either the client or the server socket.
   - It forwards data from the client to the secure server socket and vice versa, effectively tunneling the TCP connection over SSL with the modified SNI.

## Uses

1. **Bypassing SNI-Based Restrictions**: Some network restrictions rely on the SNI field to block specific websites. By using a spoofed SNI hostname, you can sometimes bypass these restrictions.
2. **Testing and Debugging**: This can be useful in penetration testing and network debugging, as it allows you to see how a server responds to different SNI hostnames.
3. **Encapsulation of Non-SSL Protocols**: With this setup, you can tunnel non-SSL-based TCP protocols over SSL, useful for legacy systems requiring security on modern networks.

## Limitations & Considerations

1. **Compatibility**: While many servers respond correctly to SNI spoofing, some use additional verification mechanisms that can detect or reject spoofed SNI requests.
2. **SSL Handshake Complexity**: Since we’re altering SSL parameters, certain systems may be incompatible with this setup if they require specific handshake details.
3. **Legal and Ethical Implications**: Using SNI spoofing and tunneling techniques without authorization can be illegal and unethical. Always get permission before testing or bypassing network restrictions.

## Conclusion

TCP over SSL tunneling with SNI spoofing provides a powerful technique for network testing and bypassing SNI-based access restrictions. By encapsulating a TCP connection within SSL and modifying the SNI field, we gain more control over secure communications, which can be useful for network administrators, testers, and researchers. However, this technique requires caution and should always be used responsibly and ethically.

## References

- [Code for SNI Spoofing](https://sourceforge.net/p/tcpoverssltunnel/code-0/ci/master/tree/client.py#l10)
- [Bypassing Content-based internet packages with an SSL/TLS Tunnel, SNI Spoofing, and DNS spoofing by Shanaka Anuradha Samarakoon](https://arxiv.org/ftp/arxiv/papers/2212/2212.05447.pdf)
- [Efficiently Bypassing SNI-based HTTPS Filtering by Wazen M. Shbair, Thibault Cholez, Antoine Goichot, Isabelle Chrisment](https://hal.inria.fr/hal-01202712/document)
