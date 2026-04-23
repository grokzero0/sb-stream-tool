<!-- README DERIVED FROM https://github.com/othneildrew/Best-README-Template/ BECAUSE I THINK THIS IS REALLY COOL-->

<!-- ------------------------------------------------------------------------------------------------------------------- -->

<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- [![Contributors][contributors-shield]][contributors-url] -->

[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]

<!-- [![Forks][forks-shield]][forks-url] -->
<!-- [![Stargazers][stars-shield]][stars-url] -->

<!-- [![LinkedIn][linkedin-shield]][linkedin-url] -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/grokzero0/sb-stream-tool">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">sb-stream-tool</h3>

  <p align="center">
    Stream tool for Super Smash Bros Melee Tournaments built in Electron + Vite + React
    <br />
    <!-- <a href="https://github.com/grokzero0/sb-stream-tool"><strong>Explore the docs »</strong></a> -->
    <!-- <br />
    <br /> -->
    <!-- <a href="https://github.com/grokzero0/sb-stream-tool">View Demo</a>
    &middot; -->
    <a href="https://github.com/grokzero0/sb-stream-tool/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/grokzero0/sb-stream-tool/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <!-- <li><a href="#usage">Usage</a></li> -->
    <li><a href="#roadmap">Roadmap</a></li>
    <!-- <li><a href="#contributing">Contributing</a></li> -->
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <!-- <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

    Melee-Ghost-Streamer was virtually unusable so I made a faster one with more features

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

<!-- Here's a blank template to get started. To avoid retyping too much info, do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`, `project_license` -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

<!-- - [![Next][Next.js]][Next-url] -->

- [![React][React.js]][React-url]
- [![Electron][Electron]][Electron-url]
- [![Vite][Vite]][Vite-url]
- [![Typescript][Typescript]][Typescript-url]
  <!-- - [![Vue][Vue.js]][Vue-url] -->
  <!-- - [![Angular][Angular.io]][Angular-url] -->
  <!-- - [![Svelte][Svelte.dev]][Svelte-url] -->
  <!-- - [![Laravel][Laravel.com]][Laravel-url] -->
  <!-- - [![Bootstrap][Bootstrap.com]][Bootstrap-url] -->
  <!-- - [![JQuery][JQuery.com]][JQuery-url] -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local build up and running follow these steps.

### Prerequisites

<!-- This is an example of how to list things you need to use the software and how to install them. -->

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

<!-- 1. Get a free API Key at [https://example.com](https://example.com) -->

1. Clone the repo and go to the directory
   ```sh
   git clone https://github.com/grokzero0/sb-stream-tool.git && cd sb-stream-tool
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. (OPTIONAL IF TRYING TO WORK WITH APOLLO CLIENT) Set VITE_STARTGG_AUTH_TOKEN to your start.gg API key in `packages/renderer/.env`
   ```sh
   VITE_STARTGG_AUTH_TOKEN=YOUR API KEY;
   ```
4. (OPTIONAL IF TRYING TO FORK/ETC) Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin grokzero0/sb-stream-tool
   git remote -v # confirm the changes
   ```
5. Create a local build
   ```sh
   npm run build
   ```
6. Start up the app
   ```sh
   npm run start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

<!-- ## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- ROADMAP -->

## Roadmap

- [x] ~~OBS integration~~
- [x] ~~Slippi integration~~
- [x] ~~Start.gg integration~~
- [x] ~~Basic keybinds~~
- [ ] More keybinds/shortcuts customization
- [ ] Web instance (Web app)
- [ ] Adjustable number of characters
- [ ] P+ integration
- [ ] Extendable templates to other games?
- [ ] parry.gg integration

<!-- See the [open issues](https://github.com/grokzero0/sb-stream-tool/issues) for a full list of proposed features (and known issues). -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

<!-- ## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- ### Top contributors:

<a href="https://github.com/grokzero0/sb-stream-tool/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=grokzero0/sb-stream-tool" alt="contrib.rocks image" />
</a> -->

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

<!-- Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com -->

Project Link: [https://github.com/grokzero0/sb-stream-tool](https://github.com/grokzero0/sb-stream-tool)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

<!-- ## Acknowledgments

- []()
- []()
- []()

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/grokzero0/sb-stream-tool.svg?style=for-the-badge
[contributors-url]: https://github.com/grokzero0/sb-stream-tool/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/grokzero0/sb-stream-tool.svg?style=for-the-badge
[forks-url]: https://github.com/grokzero0/sb-stream-tool/network/members
[stars-shield]: https://img.shields.io/github/stars/grokzero0/sb-stream-tool.svg?style=for-the-badge
[stars-url]: https://github.com/grokzero0/sb-stream-tool/stargazers
[issues-shield]: https://img.shields.io/github/issues/grokzero0/sb-stream-tool.svg?style=for-the-badge
[issues-url]: https://github.com/grokzero0/sb-stream-tool/issues
[license-shield]: https://img.shields.io/github/license/grokzero0/sb-stream-tool.svg?style=for-the-badge
[license-url]: https://github.com/grokzero0/sb-stream-tool/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png

<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
[Electron]: https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=fff
[Electron-url]: https://electronjs.org
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=fff
[Vite-url]: https://vite.dev
[Typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff
[Typescript-url]: https://www.typescriptlang.org
