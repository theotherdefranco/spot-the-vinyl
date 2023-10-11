# Spot the Vinyl 

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
This was done by following along with the [T3 Stack Tutorial](https://www.youtube.com/watch?v=YkOSUVzOAA4) on Youtube by Theo

## Intro

I had the idea of creating an app or script that uses a Spotify API that would get the top and followed artsits of the user and use those artists to find deals using [Deals On Vinyl](https://dealsonvinyl.com/) to find available vinyl records. I first used python to create a script for this project but wanted to make it more of a web app. I stumbled upon Theo's video where he breaks down how to do this. I had a school project where we used Google App Engine to create a webapp so understood some of the technologies. This was the first time I used typescript as well as all of the T3 stack. The project is still ongoing and can be found at [Spot the Vinyl](spot-the-vinyl.vercel.app) 

![Preview](https://github.com/theotherdefranco/spot-the-vinyl/assets/121998407/b30b4624-d6f2-4e39-8b2b-32402cfaa238)

## Bugs and Upcoming Features 

Currently there is an issue where when a user first signs in, the Spotify SDK authorization is called but the response of the connection is not quick enough. When the SpotifyApi object is called an error for a nonexistings cache is thrown. Can be mitigated by refreshing the page. 

The next features I plan to impliment are: 
* Webcrawler for Deals on Vinyl
* Create Artist Pages or Dynamic openings to show the deals
* Update User's current artisits
* Create New Name to go public

If interested in trying out the site, feel free to message me! 
