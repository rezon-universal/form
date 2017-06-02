#!/bin/sh

setup_git() {
  ls -la
  echo "$rezon.form.js"	
  git config --global user.email "tickets_mail@mail.ua"
  git config --global user.name "travisbotik"
}

# commit_website_files() {

  # # git checkout -b gh-pages
  # # git add . *.js
  # # git commit --message "travis build: $travis_build_number"
# }

# upload_files() {
  # git remote add origin-pages https://${gh_token}@github.com/rezon-universal/form.git > /dev/null 2>&1
  # git push --quiet --set-upstream origin-pages gh-pages 
# }

setup_git
#commit_website_files
#upload_files