"use strict";

var findById = ((users,id,cb) =>
{
		// process.nextTick(() =>
		// {
				var idx = id-1;
				if(users[idx])
				{
					cb(null,users[idx]);
				}else {
					cb(new Error('User '+id+' does not exist'));
				}
		// });
});

var findByUsername = ((users,username,cb)=>
{
		// process.nextTick(() =>
		// {
			console.log("USUARIOS EN FBU:"+users);
			for(var i=0,len = users.length; i < len; i++)
			{
				var record = users[i];
				console.log("RECORD:"+record);
				if(record.username === username)
				{
					return cb(null, record);
				}
			}
			return cb(null,null);
		// });
});

exports.findByUsername = findByUsername;
exports.findById = findById;