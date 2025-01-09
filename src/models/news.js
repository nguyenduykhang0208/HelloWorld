'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  News.init({
    title: DataTypes.TEXT('long'),
    html_content: DataTypes.TEXT('long'),
    image: DataTypes.BLOB,
    markdown_content: DataTypes.TEXT('long'),
    description: DataTypes.TEXT('long'),
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'News',
  });
  return News;
};