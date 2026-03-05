FROM nginx:1.25-alpine

# Instalar dependencias para compilar ModSecurity v3
RUN apk add --no-cache --virtual .build-deps \
    g++ \
    gcc \
    make \
    libc-dev \
    pcre-dev \
    zlib-dev \
    curl-dev \
    libxml2-dev \
    libtool \
    autoconf \
    automake \
    git \
    linux-headers \
    yajl-dev \
    geoip-dev \
    libmaxminddb-dev \
    libstdc++ \
    openssl-dev \
    pkgconf \
    && apk add --no-cache \
    pcre \
    zlib \
    curl \
    libxml2 \
    yajl \
    geoip \
    libmaxminddb \
    openssl \
    pkgconf \
    libstdc++

# Compilar ModSecurity v3
WORKDIR /tmp
RUN curl -fsSL -o modsecurity.tar.gz https://github.com/SpiderLabs/ModSecurity/releases/download/v3.0.11/modsecurity-v3.0.11.tar.gz \
    && tar -xzf modsecurity.tar.gz \
    && cd modsecurity-v3.0.11 \
    && ./build.sh \
    && ./configure \
    && make -j$(nproc) \
    && make install \
    && cd .. \
    && rm -rf modsecurity.tar.gz

# Compilar ModSecurity-Nginx connector
RUN curl -fsSL -o modsecurity-nginx.tar.gz https://github.com/SpiderLabs/ModSecurity-nginx/archive/refs/heads/master.tar.gz \
    && tar -xzf modsecurity-nginx.tar.gz \
    && mv ModSecurity-nginx-master modsecurity-nginx \
    && rm modsecurity-nginx.tar.gz

# Descargar y compilar Nginx con módulo ModSecurity
RUN NGINX_VERSION=$(nginx -v 2>&1 | sed -n 's/.*nginx version: nginx\///p') \
    && curl -fsSL -O http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz \
    && tar -xzf nginx-${NGINX_VERSION}.tar.gz \
    && cd nginx-${NGINX_VERSION} \
    && ./configure --with-compat --add-dynamic-module=../modsecurity-nginx \
    && make modules \
    && cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules/ \
    && cd .. \
    && rm -rf nginx-${NGINX_VERSION}* modsecurity-v3.0.11 modsecurity-nginx

# Descargar OWASP Core Rule Set
RUN mkdir -p /etc/nginx/crs /etc/nginx/modsecurity \
    && curl -fsSL -o /tmp/crs.tar.gz https://github.com/coreruleset/coreruleset/archive/refs/tags/v3.3.5.tar.gz \
    && tar -xzf /tmp/crs.tar.gz -C /tmp/ \
    && mv /tmp/coreruleset-3.3.5 /tmp/crs \
    && cp -r /tmp/crs/rules /etc/nginx/crs/ \
    && cp /tmp/crs/crs-setup.conf.example /etc/nginx/crs/crs-setup.conf \
    && find /etc/nginx/crs/rules -type f -name "*.conf" | sort | sed 's#^#Include #' > /etc/nginx/modsecurity/crs-rules.conf \
    && rm -rf /tmp/crs /tmp/crs.tar.gz

# Limpiar dependencias de compilación
RUN apk del .build-deps

# Crear directorios necesarios
RUN mkdir -p /var/log/nginx \
    /var/log/nginx/modsec \
    /etc/nginx/modsecurity \
    /etc/nginx/ssl

WORKDIR /etc/nginx

# Copiar configuración
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/
COPY modsecurity/ /etc/nginx/modsecurity/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
