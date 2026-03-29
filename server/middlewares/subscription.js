
export const checkSubscription = async (req, res, next)=>{
    const user = req.user;
    if(user.subscription==="ACTIVE") return next();
    if(user.subscription==="TRIAL"){
        if(new Date(user.trialEnd) > new Date()) return next();
        user.subscription="Expired";
        await user.save();
        return res.status(403).json({message:"Trial expired. Please pay"});
    }
    if(user.subscription==="EXPIRED") return res.status(403).json({message:"Subscription required"});
};