# To Do

-   [x] ~~_keeps shapes within side walls_~~ [2020-11-27]
-   [x] ~~_rotation of shapes_~~ [2020-11-27]
-   [x] ~~_loss if user reaches ceiling_~~ [2020-11-27]
-   [ ] noises when level is cleared
-   [x] ~~_don't allow shifting left/right through an existing shape_~~ [2020-11-27]
-   [ ] make it mouse controlled (for location of block) and clickable
-   [ ] implement leveling up

# Run in dev mode

```
$ npm run dev
```

problem: once shapes are rotated, I don't know their coordinates.

possible solutions

1. manually rotate using math -- this way I have the coordinates
    1. don't know how
2. see if there is a way to get the coordinates after rotation
    1. I don't think there is
3. do not rotate, but hard code the rotated shapes in
    1. ugly, takes time to calculate and such
4. create a transform method that recalculates the squares location based on transform and rotation
