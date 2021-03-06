json.partial!("user", user: @user)

json.stories do
  json.array!(@user.stories) do |story|
    json.partial! 'api/stories/story', story: story
  end
end

json.publications do
  json.array!(@user.publications) do |pub|
    json.partial! 'api/publications/pub', pub: pub
  end
end

json.followers do
  json.array!(@user.followers) do |follower|
    json.partial! 'api/users/user', user: follower
  end
end

json.followed_users do
  json.array!(@user.followed_users) do |user|
    json.partial! 'api/users/user', user: user
  end
end

# json.partial! 'api/users/user', user: current_user


json.follows do
  json.array!(@user.follows) do |follow|
    json.partial! 'api/follows/follow', follow: follow
  end
end

json.followings do
  json.array!(@user.followings) do |following|
    json.partial! 'api/follows/follow', follow: following
  end
end

json.edited_pubs do
  json.array!(@user.edited_pubs) do |pub|
    json.partial! 'api/publications/pub', pub: pub
  end
end

json.contributed_pubs do
  json.array!(@user.contributed_pubs) do |pub|
    json.partial! 'api/publications/pub', pub: pub
  end
end
