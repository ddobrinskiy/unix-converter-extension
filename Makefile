# Makefile for Unix Timestamp Converter Extension

build:
	npm run build

clean:
	rm -rf dist build

package:
	npm run package

.PHONY: build clean package
