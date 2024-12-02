build-and-push:
	docker build --file=docker/Dockerfile --tag dzhuryn/timetable-admin:dev --build-arg API_URL=http://backend.timetable.dzhuryn.site/graphql --platform linux/amd64 .
	docker push dzhuryn/timetable-admin:dev