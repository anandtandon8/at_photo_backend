# at_photo | A technologically modern photography site.

This is the backend for my photography site at: [https://atphoto.net](https://atphoto.net)

You can find the frontend repository [here](https://github.com/at-photo/at_photo_frontend).

## About ATPhoto

Tech Stack:

![image](readmeImgs/ATPhotoTechStack.png)



ATPhoto is a photography site that I am building to showcase my photography skills. I'm an avid photographer and a passionate software engineer and I wanted to combine the two. I'm also using this project as an opportunity to:

- Learn industry-standard technologies
- Use them in unique ways
- Implement my own creative solutions to real problems

The biggest problem for photography sites is the time it takes to add new content such as photos and blogs. As I'm currently a student and on the job search, I don't have much time to add new content. Although a simple solution, I used React's capabilities to automatically generate blogs with the function taking a plain text parameter.

This, for example:

![image](readmeImgs/blogComponentsSS.png)

Becomes this:

![image](readmeImgs/blogSS.png)


But that wasn't enough. So now I'm tackling the problem of adding new photos. I'm currently working on an image classification pipeline directly from my Adobe Exports to the by category galleries on my website powered by my own ML image classification model.

I'm currently implementing this:

![image](readmeImgs/ATPhotoImageClassificationPipeline.png)


Lastly, the DevOps was a fun adventure where I learned a lot about AWS, and now have robust infrastructure set up with a functioning CI/CD pipeline(after being told by many to just use Vercel).










