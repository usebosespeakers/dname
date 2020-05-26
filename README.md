# DName

An implementation of Name.com's API using Deno, Oak, and Bootstrap 4 to search word lists for available domains.

### Prerequisites

Deno >= 1.0.2

### Installing

git clone https://github.com/usebosespeakers/dname.git
cd dname

Edit config.ts with your Name.com username and API key.

### Deployment

deno run --allow-net --allow-read=./ --allow-write=./logs index.ts

http://localhost:8000 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
