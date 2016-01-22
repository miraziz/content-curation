var Backbone = require("backbone");
var _= require("underscore");

var NodeModel = Backbone.Model.extend({
	defaults: {
		title:"Untitled",
		description:"This is the description generated by default",
		children: [],
		parent: null
    },
    urlRoot: function() {
		return window.Urls["node-list"]();//('node', this.id); // use django js reverse Urls.api('house', 12)
	},
	toJSON: function() {
	  var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
	  json.cid = this.cid;
	  return json;
	}
});

var NodeCollection = Backbone.Collection.extend({
	model: NodeModel,
	save: function() {
        Backbone.sync("update", this, {url: this.model.prototype.urlRoot()});
	},
	url: function(){
       return window.Urls["node-list"]();
    },

    //get_all_fetch(ids) if get call fails, fetch from server, wrap to query multiple ids at once
   /* TODO: would be better to fetch all values at once */
    get_all_fetch: function(ids){
    	//Backbone.sync("read", this, {url: this.model.prototype.urlRoot()});
    	var to_fetch = new NodeCollection();
    	for(var i = 0; i < ids.length; i++){
    		var model = this.get({id: ids[i]});
    		
    		if(!model){
    			model = this.add({id:ids[i]});
    			model.fetch({async:false});
    		}
    		to_fetch.add(model);
    	}
    	return to_fetch;
    },
    sort_by_order:function(){
    	this.comparator = function(node){
    		return node.get("sort_order");
    	};

    	this.sort();
    	/*
    	var sorted = new NodeCollection();
    	
    	sorted = this.sortBy(function(node){
    		console.log("node", node.get("title"));
    		return node.get("title").toLowerCase();
    	});
    	
    	return sorted;
    	*/
    },
});

var TopicTreeModel = Backbone.Model.extend({
	get_root: function(){
		var collection = new NodeCollection();
		collection.root_node = this.root_node;
		console.log(this.root_node);
	},
	urlRoot: function() {
		return window.Urls["topictree-list"]();
	},
	defaults: {
		name: "Untitled Tree",
		is_published: false
	}
});

var TopicTreeModelCollection = Backbone.Collection.extend({
	model: TopicTreeModel,
	save: function() {
        Backbone.sync("update", this, {url: this.model.prototype.urlRoot()});
	},
	url: function() {
		console.log("model", this);
		return window.Urls["topictree-list"]();
	}
});

var ChannelModel = Backbone.Model.extend({
	urlRoot: function() {
		return window.Urls["channel-list"]();
	},
	defaults: {
		title: "[Untitled Content]",
		name: " ",
		editors: [],
		author: "Anonymous",
		license_owner: "No license found",
		description:" "
    },
});

var ChannelCollection = Backbone.Collection.extend({
	model: ChannelModel,

	save: function() {
        Backbone.sync("update", this, {url: this.model.prototype.urlRoot()});
	},
	url: function() {
		return window.Urls["channel-list"]();
	}
});



module.exports = {
	NodeModel: NodeModel,
	NodeCollection: NodeCollection,
	TopicTreeModel:TopicTreeModel,
	TopicTreeModelCollection: TopicTreeModelCollection,
	ChannelModel: ChannelModel,
	ChannelCollection: ChannelCollection
}