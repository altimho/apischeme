TSC = ./node_modules/.bin/tsc
UGLIFYJS = ./node_modules/.bin/uglifyjs

default: clean dist/apischeme.js dist/apischeme.min.js

clean:
	@echo "Cleaning dist…"
	@rm ./dist/*

dist/apischeme.js: src/apischeme.js
	@echo "Transpiling…"
	@$(TSC) --allowJs $^ --outFile $@

dist/apischeme.min.js: dist/apischeme.js
	@echo "Minifying…"
	@$(UGLIFYJS) $^ -o $@ --compress --mangle

.PHONY: default clean
