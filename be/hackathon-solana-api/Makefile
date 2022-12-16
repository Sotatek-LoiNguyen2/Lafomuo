deploy:
	rsync -ae "ssh -o StrictHostKeyChecking=no" -vhzL --delete \
		--no-perms --no-owner --no-group \
		--exclude .git \
		--exclude .env \
		--exclude node_modules \
		--exclude dist \
		--filter=":- .gitignore" \
		. sotatek@172.16.1.225:/home/sotatek/solana-coding-camp/be
