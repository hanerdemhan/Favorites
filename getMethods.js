const express = require("express");
const {User,Role,USER_HAS_ROLE,TAG_TABLE,USER_HAS_TAG,Mentee_fav_mentor} = require("../models/user");
const jwt = require('jsonwebtoken');
const auth = require('../controller/auth');
const router = express.Router();


router.get('/getAll', async (req, res,next) => {

    const user = await User.findAll();
    
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})
router.get('/getAll/:userName', async (req, res) => {

    const user = await User.findAll({ where: { name: req.params.userName } })

    if(!user){
       return res.status(404).json({message: 'bu ada sahip bir kullanıcı bulunamadı'})
    }
    return res.status(200).json(user);
})

router.get('/getAllTag', async (req, res,next) => {

    const user = await TAG_TABLE.findAll();
    
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})

router.get('/getTagbyUser',async(req,res)=>{

    const tags = await USER_HAS_TAG.findAll({include:{model:User} });

    if(!tags){
        return res.status(404),json({message:'Unable to do this'})
    }

    res.status(200).json(tags);
})
router.get('/getTagbyTag',async(req,res)=>{

    const tags = await USER_HAS_TAG.findAll({include:{model:TAG_TABLE} });

    if(!tags){
        return res.status(404),json({message:'Unable to do this'})
    }

    res.status(200).json(tags);
})

router.get('/getTagbyUserbyId/:user_id',async(req,res)=>{

    const tags = await USER_HAS_TAG.findOne({where:{user_id:req.params.user_id},include:{model:User} });

    if(!tags){
        return res.status(404).json({message:'Unable to do this'})
    }

    res.status(200).json(tags);
})


router.get('/getAll/limit=:limits/offset=:offsets', async (req, res) => {

    const user = await User.findAll({limit:req.params.limits, offset:req.params.offsets});
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})

router.get('/getById/:userId', async (req, res) => {

    const user = await User.findAll({ where: { id: req.params.userId } })

    if(!user){
       return res.status(404).json({message: 'hatalı'})
    }
    return res.status(200).json(user);
})



router.get('/getByRole', async (req, res) => {

    
    const user = await Role.findAll({ include: User} );
  
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
     return res.status(200).json(user);

})

router.get('/getByRole/:roleName', async (req, res) => {

    
    const user = await Role.findOne({where: {role_name: req.params.roleName}, include: User} );
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
     console.log(user.user_tables)
    res.status(200).json(user.user_tables);

})


router.get('/getByRole/:roleName/limit=:limits', async (req, res) => {

    
    const user = await Role.findOne({where: { role_name: req.params.roleName} , include: User, limit:req.params.limits});
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})

router.get('/getByRole/:roleName/:id', async (req, res) => {

    const user = await Role.findOne({ where:{role_name: req.params.roleName , id: req.params.id },  include: User },)
    if(!user){
        return res.status(404).json({message: 'hatalı'})
     }
    res.status(200).json(user);
})
//favfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfavfav
router.post('/favMentor/:mentorId', async (req, res) => {
    try {
      const { mentorId } = req.params;
      const userId = req.body.userId;
      const result = await Mentee_fav_mentor.findOne({
        where: { user_id: mentorId, fav_id: userId}
      });
      

        if(userId == mentorId) { 
          res.status(402).json("You can't favor yourself...")
        }else {
          if (!result) {
               await Mentee_fav_mentor.create({ user_id: mentorId, fav_id: userId, include: {
                model: User
              }});

              const results = await Mentee_fav_mentor.findOne({
                where: { user_id: mentorId,fav_id: userId}, include: [
                    { model: User, as: 'favMentors'}
                  ]
              });
            

            res.status(200).json({
              Favorite: true,
              msg: `Mentor added to your favorites list: ${results.favMentors.name}  ${results.favMentors.surname}`,
            });
        } else {
          await Mentee_fav_mentor.destroy({ where: result.dataValues });
          res.status(200).json({
            Favorite: false,
            msg: `Mentor removed from your favorite list`,
          });
        }}
        }catch (error) {
      res.status(500).json({ error: { msg: 'Error changing favorite status' } });
      
    }
  });
  
/////////////////////////////////get Favorite///////////////

router.get('/favMentor/:menteeId', async (req, res) => {
    try {
      const { menteeId } = req.params;
      const result = await Mentee_fav_mentor.findAll({
        where: { user_id: menteeId }, include: [
            { model: User, as: 'favMentors'}
          ],raw: true,
       
      });

      console.log(result)
  
      if (result) {
        res.status(200).json(result);;
      } else {
        res.status(200).json({
          Favorite: false,
          msg: `Mentee has not made a Favorite yet:${result}`,
        });
      }
    } catch (error) {
      res.status(500).json({ error: { msg: 'Error getting Favorite Status' } });
    }
  });
////////////////////////delete Favorite////////////////
router.delete('/favMentorDelete/:id',   async (req, res) => {

    const user = await Mentee_fav_mentor.destroy({ where: { id: req.params.id } })
   
    if(!user)
        return res.status(404).json({ message: 'My favorite could not found' });
    
    res.status(200).json({ message: 'Successful'  }); 

})

  // end fav end fav end fav end fav end fav end fav end fav end fav end fav end fav end fav end fav end fav end fav end fav 
module.exports = router;
